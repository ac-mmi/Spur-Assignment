import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/chat.service";
import { z } from "zod";
import { sendMessageSchema, sessionIdParamSchema } from "../types/schemas";

type SendMessageBody = z.infer<typeof sendMessageSchema>;
type SessionIdParams = z.infer<typeof sessionIdParamSchema>;

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { message, sessionId } = req.body as SendMessageBody;
      const result = await this.chatService.sendMessage(message, sessionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { sessionId } = req.params as unknown as SessionIdParams;
      const result = await this.chatService.getHistory(sessionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.chatService.getConversations();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
