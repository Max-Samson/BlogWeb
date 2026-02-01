import { BlogArticle, TableOfContentsItem } from "@/hooks/useBlogArticles";
import { MarkdownRenderer } from "./MarkdownRenderer";
import SvgIcon from "@/components/SvgIcon";

interface MdArticleViewProps {
  article: BlogArticle;
  tableOfContents: TableOfContentsItem[];
  activeHeading: string;
  onBack: () => void;
  onHeadingClick: (headingId: string) => void;
}

export function MdArticleView({
  article,
  tableOfContents,
  activeHeading,
  onBack,
  onHeadingClick,
}: MdArticleViewProps) {
  return (
    <div className="flex-1 order-2 lg:order-1">
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

      {/* Markdown 内容 */}
      <div className="prose prose-invert max-w-none prose-sm lg:prose-base">
        <MarkdownRenderer content={article.content} />
      </div>
    </div>
  );
}
