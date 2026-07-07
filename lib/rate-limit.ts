/**
 * In-memory rate limiter using LRU-style eviction.
 * Suitable for serverless deployments where Redis is not available.
 * NOTE: Resets on cold starts. For persistent limits, use Upstash Redis.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Max 500 unique IPs tracked to prevent memory exhaustion
const MAX_ENTRIES = 500;
const store = new Map<string, RateLimitRecord>();

function evictIfNeeded() {
  if (store.size >= MAX_ENTRIES) {
    // Evict the oldest entry (first inserted)
    const firstKey = store.keys().next().value;
    if (firstKey) store.delete(firstKey);
  }
}

/**
 * Check if the given key (IP or identifier) has exceeded the rate limit.
 * @param key       - Unique identifier, typically the client IP address.
 * @param limit     - Maximum number of requests allowed in the window.
 * @param windowMs  - Time window in milliseconds.
 * @returns `true` if the request is allowed, `false` if rate-limited.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    evictIfNeeded();
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count += 1;
  return true;
}

/**
 * Returns how many seconds remain until the rate limit window resets for a given key.
 */
export function getRemainingTtl(key: string): number {
  const record = store.get(key);
  if (!record) return 0;
  return Math.max(0, Math.ceil((record.resetAt - Date.now()) / 1000));
}
