import { ConversationRepository } from "../repositories/conversation.repository";
import { MessageRepository } from "../repositories/message.repository";
import { LLMProvider } from "./llm/llm.interface";
import {
  ChatHistoryResponse,
  ChatMessageDto,
  ConversationSummaryDto,
  MessageSender,
  SendMessageResponse,
} from "../types/chat.types";
import { NotFoundError } from "../utils/errors";
import { buildConversationTitle } from "../utils/title";
import { Conversation, Message } from "@prisma/client";

export class ChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly llmProvider: LLMProvider,
  ) {}

  async sendMessage(
    message: string,
    sessionId?: string,
  ): Promise<SendMessageResponse> {
    const conversationId = await this.resolveConversationId(sessionId);

    const history = await this.messageRepository.findByConversationId(
      conversationId,
    );

    const isFirstMessage = history.length === 0;

    await this.messageRepository.create(conversationId, "user", message);

    if (isFirstMessage) {
      await this.conversationRepository.updateTitle(
        conversationId,
        buildConversationTitle(message),
      );
    }

    const reply = await this.llmProvider.generateReply(
      history.map((msg) => ({
        sender: msg.sender as MessageSender,
        text: msg.text,
      })),
      message,
    );

    await this.messageRepository.create(conversationId, "ai", reply);

    return {
      reply,
      sessionId: conversationId,
    };
  }

  async getHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const conversation = await this.conversationRepository.findById(sessionId);

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    const messages =
      await this.messageRepository.findByConversationId(sessionId);

    return {
      sessionId,
      messages: messages.map((msg) => this.toMessageDto(msg)),
    };
  }

  async getConversations(): Promise<ConversationSummaryDto[]> {
    const conversations =
      await this.conversationRepository.findAllWithTitle();

    return conversations.map((conversation) =>
      this.toConversationSummaryDto(conversation),
    );
  }

  private async resolveConversationId(sessionId?: string): Promise<string> {
    if (!sessionId) {
      const conversation = await this.conversationRepository.create();
      return conversation.id;
    }

    const conversation =
      await this.conversationRepository.findById(sessionId);

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    return conversation.id;
  }

  private toMessageDto(message: Message): ChatMessageDto {
    return {
      id: message.id,
      sender: message.sender as MessageSender,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    };
  }

  private toConversationSummaryDto(
    conversation: Conversation,
  ): ConversationSummaryDto {
    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
    };
  }
}
