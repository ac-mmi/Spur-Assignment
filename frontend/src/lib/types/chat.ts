export type MessageSender = "user" | "ai";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: ChatMessage[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
}
