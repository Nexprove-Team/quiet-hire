import { getConfig } from "../config.js";

let tokens: number | undefined;
let lastRefill: number | undefined;

function refill(): void {
  const config = getConfig();
  const now = Date.now();
  const elapsed = now - (lastRefill ?? now);
  const rate = config.RATE_LIMIT_REQUESTS_PER_MINUTE / 60_000;
  tokens = Math.min(
    config.RATE_LIMIT_REQUESTS_PER_MINUTE,
    (tokens ?? config.RATE_LIMIT_REQUESTS_PER_MINUTE) + elapsed * rate
  );
  lastRefill = now;
}

export async function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
  const config = getConfig();

  if (tokens === undefined) {
    tokens = config.RATE_LIMIT_REQUESTS_PER_MINUTE;
    lastRefill = Date.now();
  }

  refill();

  if (tokens < 1) {
    const rate = config.RATE_LIMIT_REQUESTS_PER_MINUTE / 60_000;
    const waitMs = Math.ceil((1 - tokens) / rate);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    refill();
  }

  tokens -= 1;
  return fn();
}
