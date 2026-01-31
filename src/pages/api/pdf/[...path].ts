import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

/**
 * PDF 文件服务 API
 * 路由格式: /api/pdf/react/day01.pdf
 * 路径参数会自动解析为数组: ['react', 'day01.pdf']
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: pdfPath } = req.query;

  // Next.js [...path] 动态路由返回数组
  if (!pdfPath || !Array.isArray(pdfPath) || pdfPath.length === 0) {
    console.error("[PDF API] Invalid path:", pdfPath);
    return res.status(400).json({ error: "Invalid path" });
  }

  console.log("[PDF API] Requested:", pdfPath.join("/"));

  try {
    // 构建完整文件路径 - 使用 spread 展开数组
    const fullPath = path.join(process.cwd(), "src", "blogs", ...pdfPath);

    // 安全检查：确保路径在 blogs 目录内
    const blogsDir = path.join(process.cwd(), "src", "blogs");
    const resolvedPath = path.resolve(fullPath);

    // 规范化路径进行比较（Windows 兼容）
    const normalizedResolved = resolvedPath.toLowerCase().replace(/\\/g, "/");
    const normalizedBlogsDir = blogsDir.toLowerCase().replace(/\\/g, "/");

    if (!normalizedResolved.startsWith(normalizedBlogsDir)) {
      console.error("[PDF API] Path traversal blocked");
      return res.status(403).json({ error: "Access denied" });
    }

    // 检查文件是否存在
    if (!fs.existsSync(resolvedPath)) {
      console.error("[PDF API] File not found:", resolvedPath);
      return res.status(404).json({ error: "PDF file not found" });
    }

    // 检查是否为 PDF 文件
    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile() || !resolvedPath.toLowerCase().endsWith(".pdf")) {
      console.error("[PDF API] Not a PDF file:", resolvedPath);
      return res.status(400).json({ error: "Not a PDF file" });
    }

    console.log("[PDF API] Serving:", resolvedPath, "Size:", stat.size);

    // 设置响应头
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stat.size.toString());
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Accept-Ranges", "bytes");

    // 流式返回文件
    const fileStream = fs.createReadStream(resolvedPath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("[PDF API] Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to read PDF" });
      }
    });

  } catch (error) {
    console.error("[PDF API] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
