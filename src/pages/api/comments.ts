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
    } catch (error: unknown) {
      if (i === maxRetries - 1) throw error;
      if (error instanceof Error && "code" in error && error.code === "P1001") {
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
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // 获取评论列表（带重试）
      const comments = await withRetry(() =>
        prisma.comment.findMany({
          where: {
            parentId: null, // 只获取顶级评论
          },
          include: {
            replies: {
              include: {
                replies: true, // 支持二级回复
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      );

      res.status(200).json(comments);
    } else if (req.method === "POST") {
      // 添加评论
      const { nickname, contact, content, parentId } = req.body;

      if (!content || content.trim() === "") {
        return res.status(400).json({ error: "评论内容不能为空" });
      }

      // 创建评论（带重试）
      const comment = await withRetry(() =>
        prisma.comment.create({
          data: {
            nickname: nickname || null,
            contact: contact || null,
            content: content.trim(),
            parentId: parentId || null,
          },
          include: {
            replies: true,
          },
        })
      );

      res.status(201).json(comment);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: unknown) {
    console.error("[GET /api/comments] Error:", error);

    // 返回友好的错误信息
    if (error instanceof Error && "code" in error && error.code === "P1001") {
      res.status(503).json({
        error: "数据库连接失败，请稍后重试",
        message: "数据库正在唤醒中...",
      });
    } else {
      res.status(500).json({
        error: "服务器内部错误",
        message: error instanceof Error ? error.message : "未知错误",
      });
    }
  }
}
