import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('AdminIkhlas123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masjid-alikhlas.or.id' },
    update: {},
    create: {
      email: 'admin@masjid-alikhlas.or.id',
      name: 'Administrator',
      passwordHash,
      role: 'ADMIN',
    },
  });
  
  const pengurus = await prisma.user.upsert({
    where: { email: 'pengurus@masjid-alikhlas.or.id' },
    update: {},
    create: {
      email: 'pengurus@masjid-alikhlas.or.id',
      name: 'Pengurus Masjid',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const jamaah = await prisma.user.upsert({
    where: { email: 'jamaah@masjid-alikhlas.or.id' },
    update: {},
    create: {
      email: 'jamaah@masjid-alikhlas.or.id',
      name: 'Jamaah Masjid',
      passwordHash,
      role: 'USER',
    },
  });
  // Dummy Financial Reports (Last 6 months)
  const financialData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 15);
    // Income
    financialData.push({
      type: 'INCOME',
      amount: Math.floor(Math.random() * 5000000) + 2000000, // 2-7 Juta
      description: `Infaq Jumat Pekan ke-${i+1}`,
      category: 'Infaq',
      date: monthDate
    });
    // Expense
    financialData.push({
      type: 'EXPENSE',
      amount: Math.floor(Math.random() * 2000000) + 500000, // 500rb - 2.5 Juta
      description: `Operasional Masjid Bulan ke-${i+1}`,
      category: 'Operasional',
      date: monthDate
    });
  }
  await prisma.financialReport.createMany({ data: financialData });

  // Dummy Activities
  await prisma.activity.createMany({
    data: [
      {
        title: 'Kajian Subuh Rutin',
        description: 'Membahas Tafsir Al-Quran',
        type: 'Kajian',
        startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 5, 0),
        endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 6, 30),
        speaker: 'Ustadz Ahmad',
        location: 'Ruang Utama Masjid'
      },
      {
        title: 'TPA Anak-anak',
        description: 'Belajar membaca Iqro',
        type: 'Pendidikan',
        startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0),
        endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 30),
        speaker: 'Guru TPA',
        location: 'Teras Masjid'
      }
    ]
  });

  // Dummy Donations
  await prisma.donation.createMany({
    data: [
      { amount: 500000, donorName: 'Bapak Budi', status: 'SUCCESS', paymentType: 'TRANSFER', gatewayRef: 'TRX-123' },
      { amount: 150000, donorName: 'Hamba Allah', status: 'PENDING', paymentType: 'QRIS' },
      { amount: 1000000, donorName: 'Ibu Siti', status: 'SUCCESS', paymentType: 'TRANSFER' }
    ]
  });

  // Dummy Qurban
  await prisma.qurban.createMany({
    data: [
      { mudhohiName: 'Bapak Budi', type: 'SAPI', status: 'RECEIVED', weight: 350 },
      { mudhohiName: 'Keluarga Pak Joko', type: 'KAMBING', status: 'SLAUGHTERED', weight: 30 }
    ]
  });

  console.log('Dummy data inserted successfully!');
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
