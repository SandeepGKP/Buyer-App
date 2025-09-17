import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buyers } from '@/lib/schema'
import { createBuyerSchema } from '@/lib/zod'
import { and, like, eq, desc, count, or, sql } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBuyerSchema.parse(body)

    // Set email to null if empty, and tags to array from string
    const dataToInsert = {
      ...validatedData,
      email: validatedData.email || null,
      ownerId: 'demo-user-id', // Replace with actual auth user ID later
    }

    if (typeof (validatedData as any).tags === 'string') {
      dataToInsert.tags = (validatedData as any).tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
    }

    // Create buyer
    const newBuyer = await db.insert(buyers).values(dataToInsert).returning()

    return NextResponse.json({ success: true, buyer: newBuyer[0] })
  } catch (error: any) {
    console.error('Error creating buyer:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Filters
    const city = searchParams.get('city')
    const propertyType = searchParams.get('propertyType')
    const status = searchParams.get('status')
    const timeline = searchParams.get('timeline')
    const search = searchParams.get('search')

    const conditions = [eq(buyers.ownerId, 'demo-user-id')] // Own buyers only

    if (city) conditions.push(eq(buyers.city, city))
    if (propertyType) conditions.push(eq(buyers.propertyType, propertyType))
    if (status) conditions.push(eq(buyers.status, status))
    if (timeline) conditions.push(eq(buyers.timeline, timeline))
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(sql`(${buyers.fullName} like ${searchPattern} or ${buyers.phone} like ${searchPattern} or coalesce(${buyers.email}, '') like ${searchPattern} or coalesce(${buyers.notes}, '') like ${searchPattern})`);
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0]

    // Count total
    const totalCount = await db.select({ count: count() }).from(buyers).where(where).then(rows => rows[0].count || 0)

    // Get buyers with pagination, sorted by updatedAt desc
    const buyersList = await db.select().from(buyers).where(where).limit(limit).offset(offset).orderBy(desc(buyers.updatedAt))

    return NextResponse.json({
      buyers: buyersList,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
