const fs = require('fs');

async function runTests() {
  console.log('=== Memulai Pengujian E2E ===');
  let passed = 0;
  let failed = 0;

  const baseUrl = 'http://localhost:3000';

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ [FAIL] ${name}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Test Landing Page
  await test('Halaman Landing Page dapat diakses', async () => {
    const res = await fetch(`${baseUrl}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('Sistem Informasi & Donasi Masjid Al-Ikhlas') && !text.includes('Masjid Al-Ikhlas')) {
      throw new Error('Title tidak ditemukan');
    }
  });

  // 2. Test Login API (NextAuth)
  await test('Login Admin dengan kredensial yang benar', async () => {
    // We need to get csrf token first
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;

    const res = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfRes.headers.get('set-cookie') || ''
      },
      body: new URLSearchParams({
        email: 'admin@masjid-alikhlas.or.id',
        password: 'AdminIkhlas123',
        csrfToken: csrfToken,
        json: 'true'
      })
    });
    
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.url && data.url.includes('error=')) {
      throw new Error(`Login Ditolak: ${data.url}`);
    }
  });

  // 3. Test Unauthorized Access to Admin
  await test('Akses /admin tanpa login harus dialihkan', async () => {
    const res = await fetch(`${baseUrl}/admin`, { redirect: 'manual' });
    // Next.js middleware usually returns 307 or 308 for redirect
    if (res.status !== 307 && res.status !== 308 && res.status !== 302) {
      throw new Error(`Expected redirect (307/308), got ${res.status}`);
    }
  });

  console.log(`\n=== Hasil Pengujian ===`);
  console.log(`Total: ${passed + failed}, Lulus: ${passed}, Gagal: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
