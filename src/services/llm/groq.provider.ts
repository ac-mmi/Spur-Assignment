import OpenAI from "openai";
import {
  APIConnectionTimeoutError,
  APIError,
  AuthenticationError,
  RateLimitError,
} from "openai";
import { env } from "../../utils/env";
import {
  buildProviderMessages,
  ChatMessage,
  LLM_FALLBACK_RESPONSE,
  LLMProvider,
} from "./llm.interface";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export class GroqProvider implements LLMProvider {
  private readonly client: OpenAI;

  constructor() {
    if (!env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is required when LLM_PROVIDER is set to groq",
      );
    }

    this.client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: GROQ_BASE_URL,
      timeout: env.GROQ_TIMEOUT_MS,
      maxRetries: 0,
    });
  }

  async generateReply(
    history: ChatMessage[],
    userMessage: string,
  ): Promise<string> {
    const messages = buildProviderMessages(history, userMessage);

    try {
      const completion = await this.client.chat.completions.create({
        model: env.GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (!reply) {
        console.error("[GroqProvider] Received an empty completion");
        return LLM_FALLBACK_RESPONSE;
      }

      return reply;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): string {
    if (error instanceof RateLimitError) {
      console.error("[GroqProvider] Rate limit exceeded:", error.message);
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof AuthenticationError) {
      console.error(
        "[GroqProvider] Authentication failed — check GROQ_API_KEY",
      );
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof APIConnectionTimeoutError) {
      console.error("[GroqProvider] Request timed out");
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof APIError) {
      console.error(
        `[GroqProvider] API error (status ${error.status ?? "unknown"}):`,
        error.message,
      );
      return LLM_FALLBACK_RESPONSE;
    }

    console.error("[GroqProvider] Unexpected error:", error);
    return LLM_FALLBACK_RESPONSE;
  }
}
