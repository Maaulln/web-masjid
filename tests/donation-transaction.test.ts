describe('Donation Verification Transaction', () => {
  it('should update donation status and write financial entry + audit log', async () => {
    const mockTx = jest.fn().mockImplementation(async (callback) => {
      const prismaMock = {
        donation: { update: jest.fn().mockResolvedValue({ id: 'don-1', amount: 50000 }) },
        financialReport: { create: jest.fn().mockResolvedValue({ id: 'fin-1', amount: 50000 }) },
        auditTrail: { create: jest.fn().mockResolvedValue({ id: 'aud-1', userId: 'admin-1' }) }
      };
      return callback(prismaMock);
    });

    const executeVerification = async (prismaClient: any, donationId: string, amount: number, adminUser: any) => {
      return prismaClient.$transaction(async (tx: any) => {
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

    const result = await executeVerification({ $transaction: mockTx }, 'don-1', 50000, { id: 'admin-1', email: 'admin@mail.com' });
    expect(result.updatedDonation.id).toBe('don-1');
    expect(result.cashReport.amount).toBe(50000);
    expect(result.log.userId).toBe('admin-1');
  });
});
