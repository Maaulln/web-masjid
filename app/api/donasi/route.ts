import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple IP based rate-limiter in-memory fallback
const ipCache = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const limit = 5;
  const windowMs = 3600000; // 1 Jam

  const record = ipCache.get(ip);
  if (!record) {
    ipCache.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (now > record.resetAt) {
    ipCache.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan donasi. Silakan coba lagi nanti.' }, { status: 429 });
  }

  try {
    const { amount, category, donorName, donorEmail, turnstileToken } = await req.json();

    // 2. Turnstile Captcha verification
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA', // fallback testing key
        response: turnstileToken,
      }),
    });
    const verifyOutcome = await verifyRes.json();
    if (!verifyOutcome.success) {
      return NextResponse.json({ error: 'Verifikasi Turnstile Captcha gagal.' }, { status: 400 });
    }

    // 3. Simpan data donasi PENDING
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        category: category || 'INFAQ',
        donorName: donorName || 'Hamba Allah',
        donorEmail: donorEmail || null,
        status: 'PENDING',
        paymentType: 'MANUAL',
      },
    });

    return NextResponse.json({ success: true, donationId: donation.id });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
