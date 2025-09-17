import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { db } from '@/lib/db';
import { buyers, buyerHistory } from '@/lib/schema';
import { csvRowSchema, CsvRow } from '@/lib/zod';
import { z } from 'zod';

// Mock auth for demo - should use real auth
const getCurrentUser = () => ({ id: 'user-demo-1' });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files allowed' }, { status: 400 });
    }

    const content = await file.text();
    const rows: any[] = [];

    // Parse CSV
    const parser = parse(content, {
      skip_empty_lines: true,
      columns: [
        'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
        'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
      ],
    });

    for await (const record of parser) {
      rows.push(record);
    }

    if (rows.length > 200) {
      return NextResponse.json({ error: 'Too many rows, max 200' }, { status: 400 });
    }

    const errors: { row: number; errors: string[] }[] = [];
    const validRows: CsvRow[] = [];

    rows.forEach((row, index) => {
      try {
        const validated = csvRowSchema.parse(row);
        validRows.push(validated as CsvRow);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push({
            row: index + 1,
            errors: err.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
          });
        }
      }
    });

    if (validRows.length === 0) {
      return NextResponse.json({
        error: 'No valid rows found',
        errors,
      }, { status: 400 });
    }

    const user = getCurrentUser();

    // Insert in transaction
    await db.transaction(async (tx) => {
      for (const row of validRows) {
        const buyerId = crypto.randomUUID();

        const insertBuyer = await tx.insert(buyers).values({
          id: buyerId,
          fullName: row.fullName,
          email: row.email || null,
          phone: row.phone,
          city: row.city,
          propertyType: row.propertyType,
          bhk: row.bhk || null,
          purpose: row.purpose,
          budgetMin: row.budgetMin,
          budgetMax: row.budgetMax,
          timeline: row.timeline,
          source: row.source,
          status: row.status || 'New',
          notes: row.notes || null,
          tags: row.tags || [],
          ownerId: user.id,
        }).execute();

        // Add to history
        await tx.insert(buyerHistory).values({
          buyerId,
          changedBy: user.id,
          diff: Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k, { old: null, new: v }])
          ),
        }).execute();
      }
    });

    return NextResponse.json({
      message: `${validRows.length} buyers imported successfully`,
      errors,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
