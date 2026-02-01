import SvgIcon from "@/components/SvgIcon";
import { BlogStats, DirectoryTreeItem } from "@/hooks/useBlogArticles";
import { DirectoryTreeItem as DirectoryTreeComponent } from "./DirectoryTreeItem";
import { CategoryPanel } from "./CategoryPanel";

interface BlogStatsPanelProps {
  categories: string[];
  selectedCategory: string;
  articleCount: number;
  blogStats: BlogStats | null;
  collapsedFolders: Set<string>;
  onCategorySelect: (category: string) => void;
  toggleFolder: (folderId: string) => void;
  onFileClick: (filePath: string, fileName: string, category: string) => void;
}

export function BlogStatsPanel({
  categories,
  selectedCategory,
  articleCount,
  blogStats,
  collapsedFolders,
  onCategorySelect,
  toggleFolder,
  onFileClick,
}: BlogStatsPanelProps) {
  const panelWidth = "w-64"; // 统一宽度

  return (
    <>
      {/* 侧边栏：博客统计 */}
      <div className={`${panelWidth} sticky top-24 h-fit hidden lg:block`}>
        <div className="space-y-4">
          {/* 文章分类 */}
          {/* <CategoryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            articleCount={articleCount}
            blogStats={blogStats}
            onCategorySelect={onCategorySelect}
          /> */}

          {/* 博客统计 */}
          <aside className="rounded-2xl border border-[rgba(255,255,255,.08)] bg-[rgba(0,0,0,.25)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.25)] overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[rgba(255,255,255,.06)]">
              <SvgIcon name="count" width={18} height={18} color="#fff" />
              <h3 className="text-base font-semibold text-white">博客统计</h3>
            </div>

            {blogStats ? (
              <div className="p-3 space-y-3">
                {/* 总体统计 */}
                <div className="rounded-xl border border-[rgba(255,255,255,.06)] bg-[rgba(255,255,255,.04)] p-4">
                  <div className="flex items-center gap-2 text-white mb-3">
                    <SvgIcon
                      name="count1"
                      width={14}
                      height={14}
                      color="#fff"
                    />
                    <h4 className="text-sm font-semibold">总体统计</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* 文章 */}
                    <div className="min-w-0">
                      <div className="text-xs text-gray-300 mb-1">总文章数</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white leading-none">
                          {blogStats.totalArticles}
                        </span>
                        <span className="text-xs text-gray-300">篇</span>
                      </div>
                    </div>

                    {/* 目录 */}
                    <div className="min-w-0">
                      <div className="text-xs text-gray-300 mb-1">总目录数</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white leading-none">
                          {blogStats.totalDirectories}
                        </span>
                        <span className="text-xs text-gray-300">个</span>
                      </div>
                    </div>

                    {/* 文件 */}
                    <div className="min-w-0">
                      <div className="text-xs text-gray-300 mb-1">总文件数</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white leading-none">
                          {blogStats.totalFiles}
                        </span>
                        <span className="text-xs text-gray-300">个</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 分类统计 */}
                <div className="rounded-xl border border-[rgba(255,255,255,.06)] bg-[rgba(255,255,255,.04)] p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <SvgIcon
                      name="count2"
                      width={14}
                      height={14}
                      color="#fff"
                    />
                    <h4 className="text-sm font-semibold text-white">
                      分类统计
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(blogStats.categoryStats).map(
                      ([category, count]: [string, number]) => {
                        const percent =
                          blogStats.totalArticles > 0
                            ? Math.round(
                                (count / blogStats.totalArticles) * 100,
                              )
                            : 0;

                        return (
                          <div
                            key={category}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="text-sm text-gray-200 truncate w-20">
                              {category}
                            </span>

                            <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,.10)] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--primary-end)] to-[var(--primary-start)] transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            <span className="text-sm text-white font-semibold w-10 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* 目录结构 */}
                <div className="rounded-xl border border-[rgba(255,255,255,.06)] bg-[rgba(255,255,255,.04)] p-3">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    📁 目录结构
                  </h4>

                  <div className="h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    {blogStats?.directoryTree &&
                    blogStats.directoryTree.length > 0 ? (
                      <div className="space-y-1 text-xs text-gray-300 font-mono leading-relaxed">
                        {blogStats.directoryTree.map((item, index) => (
                          <DirectoryTreeComponent
                            key={item.id || `${item.name}-${index}`}
                            item={item}
                            collapsedFolders={collapsedFolders}
                            toggleFolder={toggleFolder}
                            onFileClick={onFileClick}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 py-6 text-center">
                        暂无目录结构
                      </div>
                    )}
                  </div>
                </div>

                {/* 更新时间 */}
                <div className="pt-2 border-t border-[rgba(255,255,255,.06)] text-center text-[11px] text-gray-400">
                  最后更新：{blogStats.lastUpdated}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-[var(--primary-end)] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-gray-400 text-sm">加载统计信息中...</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
