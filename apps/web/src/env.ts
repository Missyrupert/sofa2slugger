/** Kept so instrumentation can still boot. No payment env is required. */
export function getEnv(): Record<string, unknown> {
  return {};
}
