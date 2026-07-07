import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(req: NextRequest) {
  try {
    const { mudhohiName, mudhohiEmail, mudhohiPhone, type, weight, price, turnstileToken } = await req.json();

    if (!mudhohiName || !type) {
      return NextResponse.json({ error: 'Nama Mudhohi dan Tipe Hewan harus diisi.' }, { status: 400 });
    }
    
    const isTokenValid = await verifyTurnstileToken(turnstileToken);
    if (!isTokenValid) {
      return NextResponse.json({ error: 'Verifikasi CAPTCHA gagal' }, { status: 400 });
    }

    const qurban = await prisma.qurban.create({
      data: {
        mudhohiName,
        mudhohiEmail: mudhohiEmail || null,
        mudhohiPhone: mudhohiPhone || null,
        type,
        weight: weight ? parseFloat(weight) : null,
        price: price ? parseFloat(price) : null,
        status: 'PENDING', // Or RECEIVED depending on the workflow
      },
    });

    return NextResponse.json({ success: true, qurbanId: qurban.id });
  } catch (err: any) {
    console.error('Qurban Registration Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
