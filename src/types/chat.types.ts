export type MessageSender = "user" | "ai";

export interface ChatMessageDto {
  id: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: ChatMessageDto[];
}

export interface ConversationSummaryDto {
  id: string;
  title: string;
  createdAt: string;
}
