'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

const idSchema = z.string().min(1, 'ID tidak valid');

export async function verifyDonation(donationId: string) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = idSchema.safeParse(donationId);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get the donation
      const donation = await tx.donation.findUnique({
        where: { id: validated.data }
      });

      if (!donation) {
        throw new Error('Donasi tidak ditemukan');
      }

      if (donation.status === 'SUCCESS') {
        throw new Error('Donasi sudah diverifikasi sebelumnya');
      }

      // 2. Update donation status
      await tx.donation.update({
        where: { id: validated.data },
        data: { status: 'SUCCESS' }
      });

      // 3. Create financial report record
      await tx.financialReport.create({
        data: {
          type: 'INCOME',
          amount: donation.amount,
          description: `Donasi Online a.n. ${donation.donorName}`,
          category: 'Donasi',
        }
      });

      // 4. Create audit log
      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
          action: `Verifikasi donasi ${validated.data} senilai ${donation.amount}`,
        }
      });
    });

    revalidatePath('/admin/donasi');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Terjadi kesalahan sistem' };
  }
}

export async function rejectDonation(donationId: string) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = idSchema.safeParse(donationId);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    await prisma.donation.update({
      where: { id: validated.data },
      data: { status: 'FAILED' }
    });

    revalidatePath('/admin/donasi');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch {
    return { success: false, error: 'Terjadi kesalahan saat menolak donasi' };
  }
}
