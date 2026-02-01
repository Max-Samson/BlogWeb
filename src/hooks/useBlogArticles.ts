import { useState, useEffect, useCallback } from "react";

export interface BlogArticle {
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

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface BlogStats {
  totalArticles: number;
  totalDirectories: number;
  totalFiles: number;
  lastUpdated: string;
  categoryStats: { [key: string]: number };
  directoryTree: DirectoryTreeItem[];
}

export interface DirectoryTreeItem {
  id: string;
  name: string;
  isFolder: boolean;
  level: number;
  children: DirectoryTreeItem[];
  parentCategory?: string;
}

export function useBlogArticles() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);

  // 加载文章列表
  const loadArticles = useCallback(async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("加载文章失败");
      }
      const data = await response.json();
      setArticles(data.articles || []);
      setCategories(data.categories || ["全部"]);
      setLoading(false);
    } catch (error) {
      console.error("加载文章失败:", error);
      setArticles([]);
      setCategories(["全部"]);
      setLoading(false);
    }
  }, []);

  // 加载博客统计
  const loadBlogStats = useCallback(async () => {
    try {
      const response = await fetch("/api/blog-stats");
      if (response.ok) {
        const stats = await response.json();
        setBlogStats(stats);
      }
    } catch (error) {
      console.error("加载统计信息失败:", error);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadArticles();
    loadBlogStats();
  }, [loadArticles, loadBlogStats]);

  return {
    articles,
    categories,
    loading,
    blogStats,
    reloadArticles: loadArticles,
    reloadStats: loadBlogStats,
  };
}