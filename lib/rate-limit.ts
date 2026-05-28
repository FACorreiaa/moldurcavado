const buckets = new Map<string, number>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs?: number;
}

export function checkRateLimit(key: string, windowMs = 60_000): RateLimitResult {
  const now = Date.now();

  for (const [k, ts] of buckets) {
    if (now - ts > windowMs) buckets.delete(k);
  }

  const last = buckets.get(key);
  if (last && now - last < windowMs) {
    return { ok: false, retryAfterMs: windowMs - (now - last) };
  }

  buckets.set(key, now);
  return { ok: true };
}
