import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextApiRequest, NextApiResponse } from "next";

interface BlogArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  readTime: string;
  filename: string;
  category: string;
}

interface BlogResponse {
  articles: BlogArticle[];
  categories: string[];
}

// 递归读取文件夹，支持 MD 和 PDF 文件
function readBlogsRecursively(
  dir: string,
  baseDir: string
): {
  articles: BlogArticle[];
  categories: Set<string>;
} {
  const articles: BlogArticle[] = [];
  const categories = new Set<string>();

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归读取子文件夹
      const result = readBlogsRecursively(fullPath, baseDir);
      articles.push(...result.articles);
      result.categories.forEach((cat) => categories.add(cat));
    } else if (item.endsWith(".md") || item.endsWith(".pdf")) {
      if (item === "count.md") return; // 跳过统计文件

      // 计算相对于 blogs 目录的分类路径
      const relativePath = path.relative(baseDir, dir);
      const category = relativePath === "" ? "根目录" : relativePath;
      categories.add(category);

      const fileName = item;
      const fileContents = fs.readFileSync(fullPath, "utf-8");

      if (item.endsWith(".md")) {
        // MD 文件：解析 frontmatter 和内容
        const { data, content } = matter(fileContents);
        articles.push({
          id: `${category}-${fileName}`,
          title: data.title || item.replace(".md", ""),
          description: data.description || extractDescription(content),
          date: data.date || new Date().toISOString().split("T")[0],
          tags: data.tags || ["未分类"],
          content,
          readTime: data.readTime || "5 分钟阅读",
          filename: fileName,
          category: category,
        });
      } else if (item.endsWith(".pdf")) {
        // PDF 文件：创建特殊的 BlogArticle
        articles.push({
          id: `pdf-${category}-${fileName}`,
          title: item.replace(/\.pdf$/i, ""),
          description: `PDF 文档 - ${category}`,
          date: new Date().toISOString().split("T")[0],
          tags: ["PDF", category],
          content: `# ${item.replace(/\.pdf$/i, "")}\n\nPDF 文档预览功能已上线，点击目录树中的 PDF 文件即可在线预览。\n\n## 功能特点\n\n- 📄 在线预览 PDF 文档\n- 📖 支持翻页查看\n- 🔍 全文搜索\n- 📱 响应式适配`,
          readTime: "查看 PDF",
          filename: fileName,
          category: category,
        });
      }
    }
  });

  return { articles, categories };
}

function extractDescription(content: string): string {
  const introMatch = content.match(
    /##\s*简介\s*\n([\s\S]*?)(?=\n##|\n#|$)/
  );
  if (introMatch && introMatch[1]) {
    return introMatch[1].trim().replace(/\n/g, " ").substring(0, 150) + "...";
  }
  return "暂无描述";
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  try {
    const blogsDirectory = path.join(process.cwd(), "src", "blogs");

    // 检查 blogs 目录是否存在
    if (!fs.existsSync(blogsDirectory)) {
      return res.status(404).json({ error: "blogs目录不存在" });
    }

    // 递归读取所有文章（包括 PDF）
    const { articles, categories } = readBlogsRecursively(
      blogsDirectory,
      blogsDirectory
    );

    // 转换为分类数组
    const categoryList = ["全部", ...Array.from(categories)];

    res.status(200).json({ articles, categories: categoryList });
  } catch (error) {
    console.error("读取文章失败:", error);
    res.status(500).json({ error: "读取文章失败" });
  }
}
