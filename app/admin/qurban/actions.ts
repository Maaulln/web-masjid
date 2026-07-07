'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

const qurbanSchema = z.object({
  mudhohiName: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().optional(),
  animalType: z.enum(['SAPI', 'KAMBING']),
  status: z.enum(['LUNAS', 'DP']),
});

export async function addQurban(formData: FormData) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    mudhohiName: formData.get('mudhohiName'),
    phoneNumber: formData.get('phoneNumber') || undefined,
    animalType: formData.get('animalType'),
    status: formData.get('status'),
  };

  const validated = qurbanSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { mudhohiName, phoneNumber, animalType, status } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.qurban.create({
        data: {
          mudhohiName,
          mudhohiPhone: phoneNumber || null,
          type: animalType,
          status: status === 'LUNAS' ? 'RECEIVED' : 'RECEIVED',
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
          action: `Mendaftarkan Qurban: ${mudhohiName} (${animalType})`,
        }
      });
    });

    revalidatePath('/admin/qurban');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Gagal menyimpan data' };
  }
}

export async function deleteQurban(id: string) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.qurban.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
          action: `Menghapus pendaftar Qurban: ${record.mudhohiName}`,
        }
      });
    });

    revalidatePath('/admin/qurban');
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
