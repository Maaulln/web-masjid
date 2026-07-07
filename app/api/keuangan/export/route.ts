import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const records = await prisma.financialReport.findMany({
      orderBy: { date: 'asc' },
    });

    let csvContent = 'ID,Tanggal,Kategori,Tipe,Deskripsi,Nominal\n';
    
    records.forEach((rec) => {
      const dateStr = rec.date.toISOString().slice(0, 10);
      const escapedDesc = `"${rec.description.replace(/"/g, '""')}"`;
      const row = `${rec.id},${dateStr},${rec.category},${rec.type},${escapedDesc},${rec.amount}\n`;
      csvContent += row;
    });

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="laporan-keuangan-masjid.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
