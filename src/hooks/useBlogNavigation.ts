import { useState, useCallback } from "react";
import { BlogArticle, TableOfContentsItem } from "./useBlogArticles";

interface UseBlogNavigationProps {
  articles: BlogArticle[];
}

export function useBlogNavigation({ articles }: UseBlogNavigationProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 生成目录
  const generateTableOfContents = useCallback((content: string) => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    return headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, "");
      return {
        id: `heading-${index}`,
        title,
        level,
      };
    });
  }, []);

  // 打开文章
  const openArticle = useCallback(
    (article: BlogArticle) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedArticle(article);
        setTableOfContents(generateTableOfContents(article.content));
        setIsTransitioning(false);
      }, 300);
    },
    [generateTableOfContents],
  );

  // 返回文章列表
  const backToList = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedArticle(null);
      setTableOfContents([]);
      setIsTransitioning(false);
    }, 300);
  }, []);

  // 处理文件点击事件（支持 PDF 和 MD 文件）
  const handleFileClick = useCallback(
    (filePath: string, fileName: string, category: string) => {
      const isPdf = fileName.toLowerCase().endsWith(".pdf");
      const isMd = fileName.toLowerCase().endsWith(".md");

      if (isPdf) {
        // PDF 文件：创建临时的 BlogArticle 并打开预览
        const pdfArticle: BlogArticle = {
          id: `pdf-${filePath}`,
          title: fileName.replace(/\.pdf$/i, ""),
          description: "PDF 文档预览",
          date: new Date().toISOString().split("T")[0],
          tags: ["PDF"],
          content: `# ${fileName.replace(/\.pdf$/i, "")}\n\nPDF 文档正在预览中...`,
          readTime: "查看 PDF",
          filename: fileName,
          category: category,
        };
        openArticle(pdfArticle);
      } else if (isMd) {
        // MD 文件：从 articles 中查找对应的文章
        const article = articles.find(
          (a) => a.filename === fileName && a.category === category,
        );
        if (article) {
          openArticle(article);
        } else {
          alert("未找到对应的文章数据");
        }
      } else {
        alert("不支持的文件类型");
      }
    },
    [articles, openArticle],
  );

  // 跳转到指定标题
  const scrollToHeading = useCallback((headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // 检测文章是否是 PDF 文件
  const isPdfArticle = useCallback((article: BlogArticle) => {
    return article.filename?.toLowerCase().endsWith(".pdf");
  }, []);

  return {
    selectedArticle,
    tableOfContents,
    isTransitioning,
    openArticle,
    backToList,
    handleFileClick,
    scrollToHeading,
    isPdfArticle,
  };
}