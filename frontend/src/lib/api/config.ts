import { env } from "$env/dynamic/public";

/**
 * Resolves the backend API base URL.
 * - Production: set PUBLIC_API_URL in Vercel (e.g. https://your-app.onrender.com)
 * - Local dev: falls back to /api (proxied to localhost:3000 via vite.config.ts)
 */
export function getApiBase(): string {
  const configured = env.PUBLIC_API_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return "/api";
}
