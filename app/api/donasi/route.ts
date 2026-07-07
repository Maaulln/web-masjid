import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { checkRateLimit, getRemainingTtl } from '@/lib/rate-limit';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z
    .number()
    .positive('Nominal donasi harus lebih dari 0')
    .max(100_000_000, 'Nominal donasi melebihi batas maksimal (Rp 100 juta)'),
  category: z.enum(['INFAQ', 'SEDEKAH', 'ZAKAT', 'WAKAF', 'LAINNYA']).optional().default('INFAQ'),
  donorName: z
    .string()
    .max(100, 'Nama terlalu panjang')
    .optional()
    .default('Hamba Allah'),
  donorEmail: z
    .string()
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .optional()
    .or(z.literal('')),
  turnstileToken: z.string().min(1, 'Token CAPTCHA tidak valid'),
});

export async function POST(req: NextRequest) {
  // Rate limiting: 5 donations per IP per hour
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const isAllowed = checkRateLimit(`donasi:${ip}`, 5, 3600 * 1000);
  if (!isAllowed) {
    const retryAfter = getRemainingTtl(`donasi:${ip}`);
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan donasi. Silakan coba lagi nanti.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await req.json();

    const validated = donationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { amount, category, donorName, donorEmail, turnstileToken } = validated.data;

    // Turnstile CAPTCHA verification
    const isTokenValid = await verifyTurnstileToken(turnstileToken);
    if (!isTokenValid) {
      return NextResponse.json(
        { error: 'Verifikasi Turnstile Captcha gagal.' },
        { status: 400 }
      );
    }

    // Save pending donation
    const donation = await prisma.donation.create({
      data: {
        amount,
        category,
        donorName: donorName || 'Hamba Allah',
        donorEmail: donorEmail || null,
        status: 'PENDING',
        paymentType: 'MANUAL',
      },
    });

    return NextResponse.json({ success: true, donationId: donation.id });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
