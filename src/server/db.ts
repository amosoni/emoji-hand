import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

  // 添加连接错误处理和重试机制
  const connectWithRetry = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await client.$connect();
        console.log("✅ Database connected successfully");
        return;
      } catch (error) {
        console.error(`❌ Database connection attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          console.log(`🔄 Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // 指数退避
        } else {
          console.error("❌ All database connection attempts failed");
          // 不抛出错误，让应用继续运行
        }
      }
    }
  };
  
  void connectWithRetry();

  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();
export const prisma = db;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
