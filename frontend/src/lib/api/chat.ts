import type {
  ChatHistoryResponse,
  ConversationSummary,
  SendMessageResponse,
} from "$lib/types/chat";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export async function fetchHistory(
  sessionId: string,
): Promise<ChatHistoryResponse> {
  const response = await fetch(`${API_BASE}/chat/history/${sessionId}`);

  if (response.status === 404) {
    return { sessionId, messages: [] };
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ChatHistoryResponse>;
}

export async function fetchConversations(): Promise<ConversationSummary[]> {
  const response = await fetch(`${API_BASE}/chat/conversations`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ConversationSummary[]>;
}

export async function sendMessage(
  message: string,
  sessionId?: string,
): Promise<SendMessageResponse> {
  const response = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<SendMessageResponse>;
}
