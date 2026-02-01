import { BlogArticle, TableOfContentsItem, BlogStats } from "@/hooks/useBlogArticles";
import { PdfArticleView } from "./PdfArticleView";
import { MdArticleView } from "./MdArticleView";
import { TableOfContents } from "./TableOfContents";
import { Sidebar } from "./Sidebar";

interface ArticleDetailViewProps {
  article: BlogArticle;
  tableOfContents: TableOfContentsItem[];
  activeHeading: string;
  isTransitioning: boolean;
  // 侧边栏 props
  categories: string[];
  selectedCategory: string;
  blogStats: BlogStats | null;
  collapsedFolders: Set<string>;
  onBack: () => void;
  onHeadingClick: (headingId: string) => void;
  onCategorySelect: (category: string) => void;
  toggleFolder: (folderId: string) => void;
  onFileClick: (filePath: string, fileName: string, category: string) => void;
}

export function ArticleDetailView({
  article,
  tableOfContents,
  activeHeading,
  isTransitioning,
  categories,
  selectedCategory,
  blogStats,
  collapsedFolders,
  onBack,
  onHeadingClick,
  onCategorySelect,
  toggleFolder,
  onFileClick,
}: ArticleDetailViewProps) {
  const isPdf = article.filename?.toLowerCase().endsWith(".pdf");
  const showTableOfContents = !isPdf && tableOfContents.length > 0;

  return (
    <div
      className={`transition-all bg-[rgba(0,0,0,.1)] duration-300 p-10 rounded-lg ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* 文章详情布局 - 包含侧边栏 */}
      <div className="max-w-7xl mx-auto flex gap-4">
        {/* 左侧分类面板 - 详情页也显示 */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          articleCount={blogStats?.totalArticles || 0}
          blogStats={blogStats}
          collapsedFolders={collapsedFolders}
          onCategorySelect={onCategorySelect}
          toggleFolder={toggleFolder}
          onFileClick={onFileClick}
        />

        {/* 中间文章内容 */}
        <div className="flex-1">
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

        {/* 右侧目录或统计面板 */}
        <div className="w-80 sticky top-49 h-fit hidden lg:block">
          {showTableOfContents ? (
            <TableOfContents
              items={tableOfContents}
              activeHeading={activeHeading}
              onHeadingClick={onHeadingClick}
            />
          ) : (
            /* PDF 文件时显示简化的统计面板 */
            <div className="bg-[var(--black-light)] rounded-lg p-4 border border-[var(--white-light)]">
              <h3 className="text-base lg:text-lg font-bold text-white mb-3">
                📄 文档信息
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>文件名: {article.filename}</p>
                <p>分类: {article.category}</p>
                <p>日期: {article.date}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
