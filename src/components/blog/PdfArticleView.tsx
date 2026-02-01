import dynamic from "next/dynamic";
import { BlogArticle } from "@/hooks/useBlogArticles";
import SvgIcon from "@/components/SvgIcon";

// 动态导入 PdfViewer 组件（客户端渲染）
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
    </div>
  ),
});

interface PdfArticleViewProps {
  article: BlogArticle;
  onBack: () => void;
}

export function PdfArticleView({ article, onBack }: PdfArticleViewProps) {
  return (
    <div className="w-full">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="mb-4 lg:mb-6 bg-[var(--black-light)] hover:bg-[rgba(0,0,0,0.4)] rounded-lg px-3 py-2 lg:px-4 lg:py-2 text-white transition-colors flex items-center gap-2 text-sm lg:text-base"
      >
        <SvgIcon name="left" width={16} height={16} color="#fff" />
        返回文章列表
      </button>

      {/* 文章头部 */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-gray-300 mb-3 lg:mb-4 text-sm lg:text-base">
          <span>{article.date}</span>
          <span className="hidden sm:inline">•</span>
          <span>{article.readTime}</span>
          <span className="hidden sm:inline">•</span>
          <span>{article.category}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{article.filename}</span>
        </div>
      </div>

      {/* PDF 预览 */}
      <PdfViewer
        file={
          article.category === "根目录"
            ? `/api/pdf/${article.filename}`
            : `/api/pdf/${article.category}/${article.filename}`
        }
      />
    </div>
  );
}
