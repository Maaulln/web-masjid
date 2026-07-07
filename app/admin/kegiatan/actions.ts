'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

const activitySchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().optional(),
  type: z.string().min(1, 'Tipe kegiatan wajib diisi'),
  startDateTime: z.string().min(1, 'Waktu mulai wajib diisi'),
  endDateTime: z.string().min(1, 'Waktu selesai wajib diisi')
}).refine(data => {
  const start = new Date(data.startDateTime);
  const end = new Date(data.endDateTime);
  return start < end;
}, {
  message: 'Waktu selesai harus setelah waktu mulai',
  path: ['endDateTime']
});

export async function addActivity(formData: FormData) {
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    startDateTime: formData.get('startDateTime'),
    endDateTime: formData.get('endDateTime'),
  };

  const validated = activitySchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { title, description, type, startDateTime, endDateTime } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: {
          title,
          description: description || null,
          type,
          startDateTime: new Date(startDateTime),
          endDateTime: new Date(endDateTime)
        }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
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
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const record = await tx.activity.delete({
        where: { id }
      });

      await tx.auditTrail.create({
        data: {
          userId: (session.user as { id?: string }).id || '',
          userEmail: session.user?.email || 'admin@masjid.com',
          action: `Menghapus kegiatan: ${record.title}`,
        }
      });
    });

    revalidatePath('/admin/kegiatan');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus data' };
  }
}
