import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

// Magic byte signatures for image formats
const MAGIC_BYTES: Record<string, number[][]> = {
  '.jpg': [[0xff, 0xd8, 0xff]],
  '.jpeg': [[0xff, 0xd8, 0xff]],
  '.png': [[0x89, 0x50, 0x4e, 0x47]],
};

async function validateMagicBytes(file: File, ext: string): Promise<boolean> {
  const signatures = MAGIC_BYTES[ext];
  if (!signatures) return false;

  // Read first 8 bytes
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 8));

  return signatures.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte)
  );
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

  // Validate magic bytes to prevent extension spoofing
  const isValidMagic = await validateMagicBytes(file, ext);
  if (!isValidMagic) {
    return { success: false, error: 'Konten file tidak valid. File yang diupload bukan gambar asli.' };
  }

  try {
    const newFileName = `bukti-${uuidv4()}${ext}`;
    
    const blob = await put(newFileName, file, {
      access: 'public',
    });

    return { success: true, filePath: blob.url };
  } catch {
    return { success: false, error: 'Gagal mengunggah file bukti transfer ke Cloud Storage.' };
  }
}
