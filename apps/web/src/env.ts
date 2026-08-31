/** Minimal env check - no DB or auth required for static site. */
export function getEnv(): Record<string, unknown> {
  return {};
}
