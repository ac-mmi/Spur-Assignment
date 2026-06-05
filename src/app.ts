import express, { Application, Request, Response } from "express";
import { corsMiddleware } from "./utils/cors";
import { ChatController } from "./controllers/chat.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestLoggingMiddleware } from "./middleware/logging.middleware";
import { ConversationRepository } from "./repositories/conversation.repository";
import { MessageRepository } from "./repositories/message.repository";
import { createChatRoutes } from "./routes/chat.routes";
import { ChatService } from "./services/chat.service";
import { createLlmProvider } from "./services/llm/llm.factory";

export function createApp(): Application {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: "16kb" }));
  app.use(requestLoggingMiddleware);

  const conversationRepository = new ConversationRepository();
  const messageRepository = new MessageRepository();
  const llmProvider = createLlmProvider();
  const chatService = new ChatService(
    conversationRepository,
    messageRepository,
    llmProvider,
  );
  const chatController = new ChatController(chatService);

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/chat", createChatRoutes(chatController));

  app.use(errorMiddleware);

  return app;
}
