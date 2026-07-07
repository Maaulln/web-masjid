'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

const recordSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Kategori tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  amount: z.number().positive('Nominal harus lebih dari 0'),
  date: z.string().min(1, 'Tanggal tidak boleh kosong')
});

export async function addFinancialRecord(formData: FormData) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    type: formData.get('type'),
    category: formData.get('category'),
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount') as string),
    date: formData.get('date'),
  };

  const validated = recordSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { type, category, description, amount, date } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.financialReport.create({
        data: {
          type,
          category,
          description,
          amount,
          date: new Date(date)
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
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
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.financialReport.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
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
  } catch {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
