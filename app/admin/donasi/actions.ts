'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function verifyDonation(donationId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get the donation
      const donation = await tx.donation.findUnique({
        where: { id: donationId }
      });

      if (!donation) {
        throw new Error('Donasi tidak ditemukan');
      }

      if (donation.status === 'SUCCESS') {
        throw new Error('Donasi sudah diverifikasi sebelumnya');
      }

      // 2. Update donation status
      await tx.donation.update({
        where: { id: donationId },
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
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Verifikasi donasi ${donationId} senilai ${donation.amount}`,
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
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.donation.update({
      where: { id: donationId },
      data: { status: 'FAILED' }
    });

    revalidatePath('/admin/donasi');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Terjadi kesalahan saat menolak donasi' };
  }
}
