import { env } from "../../utils/env";
import { LLMProvider } from "./llm.interface";
import { OllamaProvider } from "./ollama.provider";
import { OpenAIProvider } from "./openai.provider";

export function createLlmProvider(): LLMProvider {
  switch (env.LLM_PROVIDER) {
    case "ollama":
      return new OllamaProvider();
    case "openai":
      return new OpenAIProvider();
    default: {
      const exhaustiveCheck: never = env.LLM_PROVIDER;
      throw new Error(`Unsupported LLM provider: ${exhaustiveCheck}`);
    }
  }
}
