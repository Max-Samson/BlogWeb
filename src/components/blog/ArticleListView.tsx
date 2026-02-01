import { useRef, useEffect, useState } from "react";
import { BlogArticle } from "@/hooks/useBlogArticles";
import SvgIcon from "@/components/SvgIcon";
import { TypewriterText } from "./TypewriterText";

interface ArticleListViewProps {
  articles: BlogArticle[];
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategorySelect: (category: string) => void;
  onArticleClick: (article: BlogArticle) => void;
}

export function ArticleListView({
  articles,
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategorySelect,
  onArticleClick,
}: ArticleListViewProps) {
  const blogContentRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 过滤文章
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "全部" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 监听滚动显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (blogContentRef.current) {
        const scrollTop = blogContentRef.current.scrollTop;
        setShowBackToTop(scrollTop > 100);
      }
    };

    let scrollContainer: HTMLElement | null = null;
    const timer = setTimeout(() => {
      scrollContainer = blogContentRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        handleScroll();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // 回到顶部函数
  const scrollToTop = () => {
    if (blogContentRef.current) {
      blogContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex-1 w-full">
      {/* 搜索栏 */}
      <div className="mb-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[40px] font-bold text-[#fff] text-shadow-sm flex items-end justify-center mb-[10px]">
            <TypewriterText text="前端 知识库" />
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-[var(--black-light)] border border-[var(--white-light)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary-end)] transition-colors"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <SvgIcon name="search" width={20} height={20} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* 移动端分类tabs */}
      <div className="mt-4 sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
          {categories.map((category) => {
            const count =
              category === "全部"
                ? articles.length
                : articles.filter((article) => article.category === category).length;

            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-[var(--primary-end)] text-white shadow-lg"
                    : "bg-[var(--black-light)] text-gray-300 hover:bg-[rgba(0,0,0,.5)] border border-[var(--white-light)]"
                }`}
              >
                {category}
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
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

      <div
        ref={blogContentRef}
        className="grid gap-3 max-h-[70vh] overflow-auto custom-scrollbar blog-content relative pb-20"
      >
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="bg-[var(--black-light)] rounded-lg p-4 cursor-pointer hover:bg-[rgba(0,0,0,0.4)] transition-all duration-200 border border-[var(--white-light)] hover:border-[var(--primary-end)] group"
          >
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-xl font-bold text-white group-hover:text-[var(--primary-end)] transition-colors">
                {article.title}
              </h2>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-gray-400">{article.date}</span>
              </div>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">{article.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[rgba(61,133,169,.2)] text-[#fff] rounded text-sm">
                  {article.category}
                </span>
              </div>
              <span className="text-sm text-gray-400">{article.readTime}</span>
            </div>
          </div>
        ))}

        {/* 回到顶部按钮 */}
        {showBackToTop && (
          <div className="sticky bottom-4 flex justify-end pr-4 pointer-events-none">
            <button
              onClick={scrollToTop}
              className="bg-[rgba(61,133,169,0.9)] hover:bg-[rgba(61,133,169,1)] text-white p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] pointer-events-auto cursor-pointer"
              aria-label="回到顶部"
            >
              <SvgIcon name="top" width={20} height={20} color="#fff" />
            </button>
          </div>
        )}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {selectedCategory === "全部"
              ? "没有找到相关文章"
              : `在 "${selectedCategory}" 分类中没有找到相关文章`}
          </p>
        </div>
      )}
    </div>
  );
}
