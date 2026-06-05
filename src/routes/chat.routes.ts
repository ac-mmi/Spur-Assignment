import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { validate } from "../middleware/validate.middleware";
import { sendMessageSchema, sessionIdParamSchema } from "../types/schemas";

export function createChatRoutes(chatController: ChatController): Router {
  const router = Router();

  router.post(
    "/message",
    validate(sendMessageSchema, "body"),
    chatController.sendMessage,
  );

  router.get(
    "/history/:sessionId",
    validate(sessionIdParamSchema, "params"),
    chatController.getHistory,
  );

  router.get("/conversations", chatController.getConversations);

  return router;
}
