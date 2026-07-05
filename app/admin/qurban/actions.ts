'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addQurban(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const mudhohiName = formData.get('mudhohiName') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const animalType = formData.get('animalType') as 'SAPI' | 'KAMBING';
  const status = formData.get('status') as 'LUNAS' | 'DP';

  if (!mudhohiName || !animalType || !status) {
    return { success: false, error: 'Nama, Jenis Hewan, dan Status wajib diisi' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.qurban.create({
        data: {
          mudhohiName,
          mudhohiPhone: phoneNumber || null,
          type: animalType,
          status: status === 'LUNAS' ? 'RECEIVED' : 'RECEIVED', // Mapped DP/Lunas to RECEIVED since schema expects QurbanStatus
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
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
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.qurban.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Menghapus pendaftar Qurban: ${record.mudhohiName}`,
        }
      });
    });

    revalidatePath('/admin/qurban');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
