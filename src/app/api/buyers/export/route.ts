import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers } from '@/lib/schema';
import { and, eq, like, or, sql } from 'drizzle-orm';
import { cities, propertyTypes, statuses, timelines, sources } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const propertyType = url.searchParams.get('propertyType');
    const status = url.searchParams.get('status');
    const timeline = url.searchParams.get('timeline');
    const search = url.searchParams.get('search');

    let whereConditions = [];

    if (city && cities.includes(city as any)) {
      whereConditions.push(eq(buyers.city, city));
    }
    if (propertyType && propertyTypes.includes(propertyType as any)) {
      whereConditions.push(eq(buyers.propertyType, propertyType));
    }
    if (status && statuses.includes(status as any)) {
      whereConditions.push(eq(buyers.status, status));
    }
    if (timeline && timelines.includes(timeline as any)) {
      whereConditions.push(eq(buyers.timeline, timeline));
    }
    if (search) {
      whereConditions.push(
        or(
          like(buyers.fullName, `%${search}%`),
          like(buyers.email, `%${search}%`),
          like(buyers.phone, `%${search}%`)
        )
      );
    }

    // Mock auth - get user id
    const userId = 'user-demo-1';

    whereConditions.push(eq(buyers.ownerId, userId));

    const buyersData = await db
      .select()
      .from(buyers)
      .where(and(...whereConditions))
      .orderBy(buyers.updatedAt);

    // Generate CSV
    const headers = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
      'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
    ];
    const csvRows = [headers.join(',')];

    buyersData.forEach(buyer => {
      const row = [
        buyer.fullName,
        buyer.email || '',
        buyer.phone,
        buyer.city,
        buyer.propertyType,
        buyer.bhk || '',
        buyer.purpose,
        buyer.budgetMin?.toString() || '',
        buyer.budgetMax?.toString() || '',
        buyer.timeline,
        buyer.source,
        buyer.notes?.replace(/"/g, '""') || '', // Escape quotes for CSV
        (buyer.tags || []).join(',').replace(/"/g, '""'),
        buyer.status,
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    const csv = csvRows.join('\n');

    // Set headers for file download
    const headersResponse = new Headers();
    headersResponse.set('Content-Type', 'text/csv');
    headersResponse.set('Content-Disposition', 'attachment; filename="buyers.csv"');

    return new NextResponse(csv, {
      status: 200,
      headers: headersResponse,
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
