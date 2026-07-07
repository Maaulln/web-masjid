import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { checkRateLimit, getRemainingTtl } from '@/lib/rate-limit';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Format email tidak valid').max(255, 'Email terlalu panjang'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 karakter simbol'),
  turnstileToken: z.string().min(1, 'Token CAPTCHA tidak valid'),
});

export async function POST(request: Request) {
  // Rate limiting: 5 requests per IP per hour
  const ip =
    (request.headers as Headers).get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  const isAllowed = checkRateLimit(`register:${ip}`, 5, 3600 * 1000);
  if (!isAllowed) {
    const retryAfter = getRemainingTtl(`register:${ip}`);
    return NextResponse.json(
      { error: `Terlalu banyak percobaan pendaftaran. Coba lagi dalam ${retryAfter} detik.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();

    const validated = registerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, turnstileToken } = validated.data;

    // CAPTCHA verification
    const isTokenValid = await verifyTurnstileToken(turnstileToken);
    if (!isTokenValid) {
      return NextResponse.json(
        { error: 'Verifikasi CAPTCHA gagal' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt cost factor 12 (stronger than default 10)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with default role 'USER'
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
      },
    });

    // Don't return password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    );
  }
}
