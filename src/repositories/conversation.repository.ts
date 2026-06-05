import { Conversation } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class ConversationRepository {
  async create(): Promise<Conversation> {
    return prisma.conversation.create({ data: {} });
  }

  async findById(id: string): Promise<Conversation | null> {
    return prisma.conversation.findUnique({ where: { id } });
  }

  async findAllWithTitle(): Promise<Conversation[]> {
    return prisma.conversation.findMany({
      where: {
        title: {
          not: "",
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTitle(id: string, title: string): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id },
      data: { title },
    });
  }
}
