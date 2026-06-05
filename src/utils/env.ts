import { z } from "zod";

const envSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1),
    LLM_PROVIDER: z.enum(["ollama", "openai"]).default("ollama"),
    OLLAMA_MODEL: z.string().min(1).default("qwen3:8b"),
    OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
    OLLAMA_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini"),
    OPENAI_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  })
  .superRefine((data, ctx) => {
    if (data.LLM_PROVIDER === "openai" && !data.OPENAI_API_KEY) {
      ctx.addIssue({
        code: "custom",
        message: "OPENAI_API_KEY is required when LLM_PROVIDER=openai",
        path: ["OPENAI_API_KEY"],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }

  return result.data;
}

export const env = loadEnv();
