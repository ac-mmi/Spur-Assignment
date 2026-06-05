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

export class OpenAIProvider implements LLMProvider {
  private readonly client: OpenAI;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is required when LLM_PROVIDER is set to openai",
      );
    }

    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      timeout: env.OPENAI_TIMEOUT_MS,
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
        model: env.OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (!reply) {
        console.error("[OpenAIProvider] Received an empty completion");
        return LLM_FALLBACK_RESPONSE;
      }

      return reply;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): string {
    if (error instanceof RateLimitError) {
      console.error("[OpenAIProvider] Rate limit exceeded:", error.message);
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof AuthenticationError) {
      console.error(
        "[OpenAIProvider] Authentication failed — check OPENAI_API_KEY",
      );
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof APIConnectionTimeoutError) {
      console.error("[OpenAIProvider] Request timed out");
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof APIError) {
      console.error(
        `[OpenAIProvider] API error (status ${error.status ?? "unknown"}):`,
        error.message,
      );
      return LLM_FALLBACK_RESPONSE;
    }

    console.error("[OpenAIProvider] Unexpected error:", error);
    return LLM_FALLBACK_RESPONSE;
  }
}
