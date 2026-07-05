import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface UploadResult {
  success: boolean;
  filePath?: string; // Menyimpan URL absolut dari Object Storage
  error?: string;
}

export async function validateAndUploadFile(
  file: File,
  allowedExtensions = ['.png', '.jpg', '.jpeg'],
  maxSize = 2 * 1024 * 1024
): Promise<UploadResult> {
  if (file.size > maxSize) {
    return { success: false, error: 'Ukuran file maksimal adalah 2MB.' };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { success: false, error: `Format file tidak diizinkan. Hanya menerima: ${allowedExtensions.join(', ')}` };
  }

  const allowedMimeTypes = ['image/png', 'image/jpeg'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { success: false, error: 'Tipe file tidak valid. Hanya menerima file gambar PNG/JPG/JPEG.' };
  }

  try {
    const newFileName = `bukti-${uuidv4()}${ext}`;
    
    // Mengunggah ke Vercel Blob secara aman di cloud (membutuhkan BLOB_READ_WRITE_TOKEN di env)
    const blob = await put(newFileName, file, {
      access: 'public',
    });

    return { success: true, filePath: blob.url };
  } catch (err) {
    return { success: false, error: 'Gagal mengunggah file bukti transfer ke Cloud Storage.' };
  }
}
