import { Message } from "@prisma/client";
import { MessageSender } from "../types/chat.types";
import { prisma } from "../utils/prisma";

export class MessageRepository {
  async create(
    conversationId: string,
    sender: MessageSender,
    text: string,
  ): Promise<Message> {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }
}
