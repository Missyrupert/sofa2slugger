/** Resolve base URL for static site. */
export function getResolvedBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
