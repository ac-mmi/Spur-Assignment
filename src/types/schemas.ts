import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be at most 2000 characters"),
  sessionId: z.string().uuid("Invalid session ID").optional(),
});

export const sessionIdParamSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
});
