import { BlogStats } from "@/hooks/useBlogArticles";

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  articleCount: number;
  blogStats: BlogStats | null;
  collapsedFolders: Set<string>;
  onCategorySelect: (category: string) => void;
  toggleFolder: (folderId: string) => void;
  onFileClick: (filePath: string, fileName: string, category: string) => void;
}

export function Sidebar({
  categories,
  selectedCategory,
  articleCount,
  blogStats,
  collapsedFolders,
  onCategorySelect,
  toggleFolder,
  onFileClick,
}: SidebarProps) {
  return (
    <>
      {/* 左侧分类面板 */}
      <div className="w-64 sticky top-45 h-fit hidden sm:block">
        <div className="bg-[var(--black-light)] rounded-lg p-4 border border-[var(--white-light)]">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            🏷️
            文章分类
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const count =
                category === "全部"
                  ? articleCount
                  : blogStats?.categoryStats?.[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => onCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                    selectedCategory === category
                      ? "bg-[var(--primary-end)] text-white shadow-lg"
                      : "bg-[rgba(0,0,0,.2)] text-gray-300 hover:bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,.05)]"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category
                        ? "bg-[rgba(255,255,255,.2)] text-white"
                        : "bg-[rgba(255,255,255,.1)] text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧统计面板 */}
      <div className="w-80 sticky top-49 h-fit hidden lg:block">
        <div className="bg-[var(--black-light)] rounded-lg p-3 border border-[var(--white-light)]">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <SvgIcon name="count" width={20} height={20} color="#fff" />
            博客统计
          </h3>

          {blogStats ? (
            <div className="space-y-3">
              {/* 总体统计 */}
              <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                  <SvgIcon name="count1" width={15} height={15} color="#fff" />
                  总体统计
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">总文章数</span>
                    <span className="text-white font-medium">{blogStats.totalArticles} 篇</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">总目录数</span>
                    <span className="text-white font-medium">{blogStats.totalDirectories} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">总文件数</span>
                    <span className="text-white font-medium">{blogStats.totalFiles} 个</span>
                  </div>
                </div>
              </div>

              {/* 分类统计 */}
              <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                  <SvgIcon name="count2" width={15} height={15} color="#fff" />
                  分类统计
                </h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(blogStats.categoryStats).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-300">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[rgba(255,255,255,.1)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--primary-end)] to-[var(--primary-start)] rounded-full transition-all duration-300"
                            style={{
                              width: `${(count / blogStats.totalArticles) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 目录结构 */}
              <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4 overflow-y-auto custom-scrollbar h-[150px]">
                <h4 className="text-sm font-medium text-[#fff] mb-3">📁 目录结构</h4>
                <div className="text-xs text-gray-300 font-mono leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                  {blogStats?.directoryTree && blogStats.directoryTree.length > 0 ? (
                    <div className="space-y-1">
                      {blogStats.directoryTree.map((item, index) => (
                        <DirectoryTreeItem
                          key={item.id || `${item.name}-${index}`}
                          item={item}
                          collapsedFolders={collapsedFolders}
                          toggleFolder={toggleFolder}
                          onFileClick={onFileClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">暂无目录结构</div>
                  )}
                </div>
              </div>

              {/* 更新时间 */}
              <div className="text-xs text-gray-400 text-center pt-2 border-t border-[var(--white-light)]">
                最后更新: {blogStats.lastUpdated}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-[var(--primary-end)] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">加载统计信息中...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import SvgIcon from "@/components/SvgIcon";
import { DirectoryTreeItem as DirectoryTreeItemType } from "@/hooks/useBlogArticles";
import { DirectoryTreeItem } from "./DirectoryTreeItem";
