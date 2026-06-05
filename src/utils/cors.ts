import cors, { CorsOptions } from "cors";
import { env } from "./env";

export function createCorsOptions(): CorsOptions {
  if (env.NODE_ENV !== "production") {
    return {
      origin: true,
      credentials: true,
    };
  }

  return {
    origin: env.FRONTEND_URL,
    credentials: true,
  };
}

export const corsMiddleware = cors(createCorsOptions());
