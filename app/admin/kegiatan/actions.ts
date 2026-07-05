'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addActivity(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const startStr = formData.get('startDateTime') as string;
  const endStr = formData.get('endDateTime') as string;

  if (!title || !type || !startStr || !endStr) {
    return { success: false, error: 'Field utama wajib diisi' };
  }

  const startDateTime = new Date(startStr);
  const endDateTime = new Date(endStr);

  if (startDateTime >= endDateTime) {
    return { success: false, error: 'Waktu selesai harus setelah waktu mulai' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: {
          title,
          description,
          type,
          startDateTime,
          endDateTime
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Menambahkan kegiatan baru: ${title}`,
        }
      });
    });

    revalidatePath('/admin/kegiatan');
    revalidatePath('/admin/dashboard');
    revalidatePath('/'); // Landing page might show this
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Gagal menyimpan data' };
  }
}

export async function deleteActivity(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.activity.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email!,
          action: `Menghapus kegiatan: ${record.title}`,
        }
      });
    });

    revalidatePath('/admin/kegiatan');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
