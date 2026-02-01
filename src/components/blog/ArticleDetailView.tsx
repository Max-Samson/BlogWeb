import { BlogArticle, TableOfContentsItem } from "@/hooks/useBlogArticles";
import { PdfArticleView } from "./PdfArticleView";
import { MdArticleView } from "./MdArticleView";
import { TableOfContents } from "./TableOfContents";

interface ArticleDetailViewProps {
  article: BlogArticle;
  tableOfContents: TableOfContentsItem[];
  activeHeading: string;
  isTransitioning: boolean;
  onBack: () => void;
  onHeadingClick: (headingId: string) => void;
}

export function ArticleDetailView({
  article,
  tableOfContents,
  activeHeading,
  isTransitioning,
  onBack,
  onHeadingClick,
}: ArticleDetailViewProps) {
  const isPdf = article.filename?.toLowerCase().endsWith(".pdf");
  const showTableOfContents = !isPdf && tableOfContents.length > 0;

  return (
    <div
      className={`transition-all bg-[rgba(0,0,0,.1)] duration-300 p-10 rounded-lg ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* 文章内容 */}
        <div className="flex-1 order-2 lg:order-1">
          {isPdf ? (
            <PdfArticleView article={article} onBack={onBack} />
          ) : (
            <MdArticleView
              article={article}
              tableOfContents={tableOfContents}
              activeHeading={activeHeading}
              onBack={onBack}
              onHeadingClick={onHeadingClick}
            />
          )}
        </div>

        {/* 目录 - 仅 MD 文件且桌面端显示 */}
        {showTableOfContents && (
          <div className="w-full max-w-[300px] order-1 lg:order-2 lg:sticky lg:top-20 lg:h-fit">
            <TableOfContents
              items={tableOfContents}
              activeHeading={activeHeading}
              onHeadingClick={onHeadingClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
