import "dotenv/config";
import { createApp } from "./app";
import { env } from "./utils/env";
import { prisma } from "./utils/prisma";

const app = createApp();

async function start(): Promise<void> {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

const shutdown = async (signal: string): Promise<void> => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void start();
