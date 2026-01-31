import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import pusher from "@/lib/pusher";

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
      const { roomId, page = "1", limit = "50" } = req.query;

      const messages = await withRetry(() =>
        prisma.message.findMany({
          where: { roomId: roomId as string },
          orderBy: { createdAt: "desc" },
          take: parseInt(limit as string),
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        })
      );

      res.status(200).json(messages.reverse());
    } catch (error: any) {
      console.error("[GET /api/chat/messages] Error:", error);
      if (error.code === "P1001") {
        res.status(503).json({
          error: "数据库连接失败，请稍后重试",
          message: "数据库正在唤醒中...",
        });
      } else {
        res.status(500).json({
          error: "Failed to fetch messages",
          message: error.message,
        });
      }
    }
  } else if (req.method === "POST") {
    try {
      const { content, userId, userName, userAvatar, roomId } = req.body;

      // 保存消息到数据库（带重试）
      const message = await withRetry(() =>
        prisma.message.create({
          data: {
            content,
            userId,
            userName,
            userAvatar,
            roomId,
          },
        })
      );

      // 更新房间的最后更新时间（带重试）
      await withRetry(() =>
        prisma.chatRoom.update({
          where: { id: roomId },
          data: { updatedAt: new Date() },
        })
      );

      console.log(`Broadcasting message to channel: chat-room-${roomId}`);
      // 通过 Pusher 广播消息
      await pusher.trigger(`presence-chat-room-${roomId}`, "new-message", {
        id: message.id,
        content: message.content,
        userId: message.userId,
        userName: message.userName,
        userAvatar: message.userAvatar,
        createdAt: message.createdAt,
      });
      console.log("Message broadcasted successfully");
      res.status(201).json(message);
    } catch (error: any) {
      console.error("[POST /api/chat/messages] Error:", error);
      if (error.code === "P1001") {
        res.status(503).json({
          error: "数据库连接失败，请稍后重试",
          message: "数据库正在唤醒中...",
        });
      } else {
        res.status(500).json({
          error: "Failed to send message",
          message: error.message,
        });
      }
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
