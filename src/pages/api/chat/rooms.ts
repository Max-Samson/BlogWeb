import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

// 带重试的数据库查询
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      if (error.code === "P1001") {
        console.log(`数据库连接失败，${delay}ms 后重试 (${i + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("重试次数已用尽");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const rooms = await withRetry(() =>
        prisma.chatRoom.findMany({
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            _count: {
              select: { messages: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        })
      );

      res.status(200).json(rooms);
    } catch (error: any) {
      console.error("[GET /api/chat/rooms] Error:", error);
      if (error.code === "P1001") {
        res.status(503).json({
          error: "数据库连接失败，请稍后重试",
          message: "数据库正在唤醒中...",
        });
      } else {
        res.status(500).json({
          error: "Failed to fetch rooms",
          message: error.message,
        });
      }
    }
  } else if (req.method === "POST") {
    try {
      const { name, description } = req.body;

      const room = await withRetry(() =>
        prisma.chatRoom.create({
          data: {
            name,
            description,
          },
        })
      );

      res.status(201).json(room);
    } catch (error: any) {
      console.error("[POST /api/chat/rooms] Error:", error);
      if (error.code === "P1001") {
        res.status(503).json({
          error: "数据库连接失败，请稍后重试",
          message: "数据库正在唤醒中...",
        });
      } else {
        res.status(500).json({
          error: "Failed to create room",
          message: error.message,
        });
      }
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
