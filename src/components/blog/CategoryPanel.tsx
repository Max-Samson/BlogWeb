import { BlogStats } from "@/hooks/useBlogArticles";

interface CategoryPanelProps {
  categories: string[];
  selectedCategory: string;
  articleCount: number;
  blogStats: BlogStats | null;
  onCategorySelect: (category: string) => void;
}

export function CategoryPanel({
  categories,
  selectedCategory,
  articleCount,
  blogStats,
  onCategorySelect,
}: CategoryPanelProps) {
  return (
    <aside
      aria-label="文章分类"
      className="
    relative
    rounded-2xl
    border border-[rgba(255,255,255,.10)]
    bg-[rgba(0,0,0,.28)]
    backdrop-blur-2xl
    shadow-[0_12px_32px_rgba(0,0,0,.28)]
    overflow-hidden
  "
    >
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,.08)]">
        <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
          🏷️ 文章分类
        </h3>
        <span className="text-xs text-gray-400">共 {articleCount} 篇</span>
      </header>

      {/* Content */}
      <div className="p-3">
        <div
          className="
      flex flex-wrap gap-2
      max-h-[160px]
      overflow-y-auto
      pr-1
      custom-scrollbar
    "
        >
          {[
            ...(categories.includes("全部") ? ["全部"] : []),
            ...categories.filter((c) => c !== "全部"),
          ].map((category) => {
            const count =
              category === "全部"
                ? articleCount
                : blogStats?.categoryStats?.[category] || 0;

            const active = selectedCategory === category;
            const isAll = category === "全部";

            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                aria-pressed={active}
                className={`
            group relative inline-flex items-center gap-2
            h-9
            rounded-full
            border
            px-3.5
            text-sm font-medium
            max-w-full
            select-none
            transition-[background,box-shadow,transform,border-color,color] duration-200 ease-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-end)]
            ${
              active
                ? `
                  bg-gradient-to-r from-[var(--primary-end)] to-[var(--primary-start)]
                  text-white
                  border-[rgba(255,255,255,.22)]
                  ring-1 ring-[rgba(255,255,255,.20)]
                  shadow-[0_10px_22px_rgba(236,72,153,.18)]
                  scale-[1.02]
                `
                : `
                  bg-[rgba(255,255,255,.05)]
                  text-gray-200
                  border-[rgba(255,255,255,.10)]
                  hover:bg-[rgba(255,255,255,.09)]
                `
            }
            ${
              // “全部”轻微识别：不靠位移，不破坏对齐
              isAll && !active ? "ring-1 ring-[rgba(255,255,255,.10)]" : ""
            }
          `}
              >
                {/* 分类名 */}
                <span
                  className={`truncate ${isAll ? "max-w-[80px]" : "max-w-[120px]"}`}
                >
                  {category}
                </span>

                {/* 数量徽章：选中态更融合，不像拼接块 */}
                <span
                  className={`
              ml-0.5
              h-6 min-w-[26px] px-2
              rounded-full
              text-[11px] font-semibold
              inline-flex items-center justify-center
              border
              transition-colors duration-200
              ${
                active
                  ? `
                    bg-[rgba(255,255,255,.18)]
                    text-white
                    border-[rgba(255,255,255,.18)]
                  `
                  : `
                    bg-[rgba(255,255,255,.10)]
                    text-gray-300
                    border-[rgba(255,255,255,.10)]
                  `
              }
            `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
