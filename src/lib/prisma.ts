/**
 * Prisma Client singleton
 * ### 主要作用
 * 1.
 * 单例模式 ：确保整个应用只有一个 Prisma 客户端实例
 * 2.
 * 连接池管理 ：避免创建过多数据库连接
 * 3.
 * 开发环境优化 ：防止 Next.js 热重载时重复创建客户端
 * 4.
 * 查询日志 ：启用 SQL 查询日志，便于调试
 * 5.
 * 全局访问 ：在整个应用中可以导入使用
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
    // 增加 Neon 连接超时时间
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 测试数据库连接
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ 数据库连接成功");
    return true;
  } catch (error) {
    console.error("❌ 数据库连接失败:", error);
    return false;
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
