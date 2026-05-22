import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

const envFiles = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "../../.env.local"),
];

for (const envFile of envFiles) {
  dotenv.config({ path: envFile, override: false, quiet: true });
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
};

export default nextConfig;
