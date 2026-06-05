import { env } from "../../utils/env";
import {
  buildProviderMessages,
  ChatMessage,
  LLM_FALLBACK_RESPONSE,
  LLMProvider,
  ProviderChatMessage,
} from "./llm.interface";

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
  error?: string;
}

export class OllamaProvider implements LLMProvider {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor() {
    this.baseUrl = env.OLLAMA_BASE_URL!.replace(/\/$/, "");
    this.model = env.OLLAMA_MODEL;
    this.timeoutMs = env.OLLAMA_TIMEOUT_MS;
  }

  async generateReply(
    history: ChatMessage[],
    userMessage: string,
  ): Promise<string> {
    const messages = buildProviderMessages(history, userMessage);

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.buildRequestBody(messages)),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error(
          `[OllamaProvider] Request failed with status ${response.status}:`,
          errorBody,
        );
        return LLM_FALLBACK_RESPONSE;
      }

      const data = (await response.json()) as OllamaChatResponse;

      if (data.error) {
        console.error("[OllamaProvider] API error:", data.error);
        return LLM_FALLBACK_RESPONSE;
      }

      const reply = data.message?.content?.trim();

      if (!reply) {
        console.error("[OllamaProvider] Received an empty completion");
        return LLM_FALLBACK_RESPONSE;
      }

      return reply;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private buildRequestBody(messages: ProviderChatMessage[]) {
    return {
      model: this.model,
      messages,
      stream: false,
    };
  }

  private handleError(error: unknown): string {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      console.error("[OllamaProvider] Request timed out");
      return LLM_FALLBACK_RESPONSE;
    }

    if (error instanceof TypeError) {
      console.error(
        "[OllamaProvider] Connection failed — is Ollama running?",
        error.message,
      );
      return LLM_FALLBACK_RESPONSE;
    }

    console.error("[OllamaProvider] Unexpected error:", error);
    return LLM_FALLBACK_RESPONSE;
  }
}
