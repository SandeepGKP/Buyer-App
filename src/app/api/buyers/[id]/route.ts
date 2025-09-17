import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers, buyerHistory } from '@/lib/schema';
import { updateBuyerSchema } from '@/lib/zod';
import { eq } from 'drizzle-orm';
import { demoUserId } from '@/lib/auth';

// Mock auth
const getCurrentUser = () => ({ id: demoUserId });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser();
    const { id: buyerId } = await params;

    const buyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, buyerId))
      .limit(1)
      .then(rows => rows[0]);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Anyone logged in can view all buyers, ownership check is for edit/delete
    // No ownership check for GET

    // Get history
    const history = await db
      .select()
      .from(buyerHistory)
      .where(eq(buyerHistory.buyerId, buyerId))
      .orderBy(buyerHistory.changedAt);

    return NextResponse.json({ buyer, history });
  } catch (error: any) {
    console.error('Error fetching buyer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser();
    const { id: buyerId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateBuyerSchema.parse(body);

    // Check ownership
    const existingBuyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, buyerId))
      .limit(1)
      .then(rows => rows[0]);

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (existingBuyer.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check updatedAt for concurrency
    if (validatedData.updatedAt) {
      const formUpdatedAt = new Date(validatedData.updatedAt).getTime();
      const dbUpdatedAt = existingBuyer.updatedAt instanceof Date ? existingBuyer.updatedAt.getTime() : existingBuyer.updatedAt;
      if (dbUpdatedAt !== formUpdatedAt) {
        return NextResponse.json({ error: 'Record changed, please refresh' }, { status: 409 });
      }
    }

    // Prepare update data
    const updateData: any = {
      fullName: validatedData.fullName,
      email: validatedData.email || null,
      phone: validatedData.phone,
      city: validatedData.city,
      propertyType: validatedData.propertyType,
      bhk: validatedData.bhk,
      purpose: validatedData.purpose,
      budgetMin: validatedData.budgetMin,
      budgetMax: validatedData.budgetMax,
      timeline: validatedData.timeline,
      source: validatedData.source,
      notes: validatedData.notes,
      tags: validatedData.tags || [],
    };

    if ((validatedData as any).status !== undefined) updateData.status = (validatedData as any).status;

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    await db.transaction((tx) => { // Synchronous callback
      return new Promise<void>(async (resolve, reject) => { // Return a promise
        try {
          // Update buyer
          await tx
            .update(buyers)
            .set(updateData)
            .where(eq(buyers.id, buyerId));

          // Record history
          const diff: any = {};
          Object.keys(updateData).forEach(key => {
            const oldVal = (existingBuyer as any)[key];
            const newVal = updateData[key];

            if (key === 'tags') {
              // Deep compare arrays for tags
              const oldTags = Array.isArray(oldVal) ? oldVal.sort() : [];
              const newTags = Array.isArray(newVal) ? newVal.sort() : [];
              if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
                diff[key] = {
                  old: oldVal,
                  new: newVal,
                };
              }
            } else if (oldVal !== newVal) {
              diff[key] = {
                old: oldVal,
                new: newVal,
              };
            }
          });

          if (Object.keys(diff).length > 0) {
            await tx.insert(buyerHistory).values({
              buyerId,
              changedBy: user.id,
              diff,
            });
          }
          resolve(); // Resolve the promise
        } catch (error) {
          reject(error); // Reject on error
        }
      });
    });

    // Get updated buyer
    const updatedBuyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, buyerId))
      .limit(1)
      .then(rows => rows[0]);

    return NextResponse.json({ updatedBuyer });
  } catch (error: any) {
    console.error('Error updating buyer:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser();
    const { id: buyerId } = await params;

    // Check ownership
    const buyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, buyerId))
      .limit(1)
      .then(rows => rows[0]);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (buyer.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete buyer (cascade will delete history)
    await db.delete(buyers).where(eq(buyers.id, buyerId));

    return NextResponse.json({ message: 'Buyer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
