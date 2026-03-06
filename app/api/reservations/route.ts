import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Occasion } from '@prisma/client'

// ─── POST /api/reservations ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      guests,
      occasion,
      specialRequest,
      lang,
    } = body

    // Basic validation
    if (!firstName || !lastName || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        firstName: String(firstName).trim(),
        lastName:  String(lastName).trim(),
        email:     String(email).toLowerCase().trim(),
        phone:     String(phone ?? '').trim(),
        date:      new Date(date),
        time:      String(time),
        guests:    Number(guests) || 2,
        occasion:  (occasion as Occasion) ?? Occasion.DINNER,
        specialRequest: specialRequest ? String(specialRequest).trim() : null,
        lang:      lang === 'en' ? 'en' : 'de',
      },
    })

    return NextResponse.json({ success: true, id: reservation.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/reservations]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── GET /api/reservations ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const dateStr = searchParams.get('date')

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(dateStr ? { date: new Date(dateStr) } : {}),
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(reservations)
  } catch (err) {
    console.error('[GET /api/reservations]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
