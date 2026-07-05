'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { revalidatePath, revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

export async function addFinancialRecord(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const type = formData.get('type') as 'INCOME' | 'EXPENSE';
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const dateStr = formData.get('date') as string;

  if (!type || !category || !description || isNaN(amount) || !dateStr) {
    return { success: false, error: 'Semua field wajib diisi' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.financialReport.create({
        data: {
          type,
          category,
          description,
          amount,
          date: new Date(dateStr)
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Menambahkan rekam keuangan ${type}: ${description} senilai ${amount}`,
        }
      });
    });

    revalidatePath('/admin/keuangan');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    revalidatePath('/transparansi');
    revalidateTag('financial-summary', 'max');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Gagal menyimpan data' };
  }
}

export async function deleteFinancialRecord(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.financialReport.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Menghapus rekam keuangan ${record.type}: ${record.description} senilai ${record.amount}`,
        }
      });
    });

    revalidatePath('/admin/keuangan');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    revalidatePath('/transparansi');
    revalidateTag('financial-summary', 'max');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
