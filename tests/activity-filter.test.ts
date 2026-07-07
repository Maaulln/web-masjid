
describe('Activity Auto-Off Logic', () => {
  it('should filter out activities that have expired', () => {
    const now = new Date();
    const mockActivities = [
      {
        id: '1',
        title: 'Kajian Subuh Aktif',
        startDateTime: new Date(now.getTime() - 3600000),
        endDateTime: new Date(now.getTime() + 3600000), // Selesai 1 jam lagi (aktif)
      },
      {
        id: '2',
        title: 'Kajian Subuh Expired',
        startDateTime: new Date(now.getTime() - 7200000),
        endDateTime: new Date(now.getTime() - 3600000), // Selesai 1 jam lalu (off)
      }
    ];

    const active = mockActivities.filter(act => act.endDateTime >= now);
    expect(active.length).toBe(1);
    expect(active[0].id).toBe('1');
  });
});
