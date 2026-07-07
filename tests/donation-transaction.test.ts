interface PrismaMock {
  donation: { update: jest.Mock };
  financialReport: { create: jest.Mock };
  auditTrail: { create: jest.Mock };
}

describe('Donation Verification Transaction', () => {
  it('should update donation status and write financial entry + audit log', async () => {
    const prismaMock: PrismaMock = {
      donation: { update: jest.fn().mockResolvedValue({ id: 'don-1', amount: 50000 }) },
      financialReport: { create: jest.fn().mockResolvedValue({ id: 'fin-1', amount: 50000 }) },
      auditTrail: { create: jest.fn().mockResolvedValue({ id: 'aud-1', userId: 'admin-1' }) }
    };

    const mockTx = jest.fn().mockImplementation(async (callback: (tx: PrismaMock) => Promise<unknown>) => {
      return callback(prismaMock);
    });

    const executeVerification = async (
      prismaClient: { $transaction: typeof mockTx },
      donationId: string,
      amount: number,
      adminUser: { id: string; email: string }
    ) => {
      return prismaClient.$transaction(async (tx: PrismaMock) => {
        const updatedDonation = await tx.donation.update({
          where: { id: donationId },
          data: { status: 'SUCCESS' }
        });
        const cashReport = await tx.financialReport.create({
          data: { type: 'INCOME', amount, description: 'Donasi Online Sukses', category: 'Donasi' }
        });
        const log = await tx.auditTrail.create({
          data: { userId: adminUser.id, userEmail: adminUser.email, action: `Verifikasi donasi ${donationId}` }
        });
        return { updatedDonation, cashReport, log };
      });
    };

    const result = await executeVerification({ $transaction: mockTx }, 'don-1', 50000, { id: 'admin-1', email: 'admin@mail.com' }) as {
      updatedDonation: { id: string };
      cashReport: { amount: number };
      log: { userId: string };
    };
    expect(result.updatedDonation.id).toBe('don-1');
    expect(result.cashReport.amount).toBe(50000);
    expect(result.log.userId).toBe('admin-1');
  });
});
