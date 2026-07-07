export async function verifyTurnstileToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA', // fallback testing key
        response: token,
      }),
    });

    const verifyData = await verifyRes.json();
    return verifyData.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
