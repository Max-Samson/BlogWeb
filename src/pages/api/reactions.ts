import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const REACTION_TYPES = [
  "like",
  "cheer",
  "celebrate",
  "appreciate",
  "smile",
] as const;
type ReactionType = (typeof REACTION_TYPES)[number];

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
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // 获取所有类型的点赞数量（带重试）
      const reactions = await withRetry(() =>
        prisma.reaction.findMany({
          select: {
            type: true,
            count: true,
          },
        })
      );

      // 确保所有类型都有记录，没有的话返回0
      const reactionMap: Record<ReactionType, number> = {
        like: 0,
        cheer: 0,
        celebrate: 0,
        appreciate: 0,
        smile: 0,
      };

      reactions.forEach((reaction) => {
        if (REACTION_TYPES.includes(reaction.type as ReactionType)) {
          reactionMap[reaction.type as ReactionType] = reaction.count;
        }
      });

      res.status(200).json(reactionMap);
    } else if (req.method === "POST") {
      // 增加特定类型的点赞数量（带重试）
      const { type } = req.body;

      if (!type || !REACTION_TYPES.includes(type)) {
        return res.status(400).json({ error: "无效的点赞类型" });
      }

      // 使用 upsert 来创建或更新记录
      const reaction = await withRetry(() =>
        prisma.reaction.upsert({
          where: { type },
          update: {
            count: {
              increment: 1,
            },
          },
          create: {
            type,
            count: 1,
          },
        })
      );

      res.status(200).json({ type: reaction.type, count: reaction.count });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("[GET /api/reactions] Error:", error);

    // 返回友好的错误信息
    if (error.code === "P1001") {
      res.status(503).json({
        error: "数据库连接失败，请稍后重试",
        message: "数据库正在唤醒中...",
      });
    } else {
      res.status(500).json({
        error: "服务器内部错误",
        message: error.message || "未知错误",
      });
    }
  }
}
