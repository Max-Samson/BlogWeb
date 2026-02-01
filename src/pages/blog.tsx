import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import SvgIcon from "@/components/SvgIcon";
import { useBlogArticles, DirectoryTreeItem } from "@/hooks/useBlogArticles";
import { useBlogNavigation } from "@/hooks/useBlogNavigation";
import { ArticleListView } from "@/components/blog/ArticleListView";
import { ArticleDetailView } from "@/components/blog/ArticleDetailView";
import { Sidebar } from "@/components/blog/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Blog() {
  // 数据 hooks
  const { articles, categories, loading, blogStats } = useBlogArticles();
  const {
    selectedArticle,
    tableOfContents,
    isTransitioning,
    openArticle,
    backToList,
    handleFileClick,
    scrollToHeading,
  } = useBlogNavigation({ articles });

  // 本地状态
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [activeHeading, setActiveHeading] = useState("");
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

  // 折叠状态管理
  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // 初始化折叠状态
  useEffect(() => {
    if (blogStats?.directoryTree) {
      const getAllFolderIds = (items: DirectoryTreeItem[]): string[] => {
        const folderIds: string[] = [];
        items.forEach((item) => {
          if (item.isFolder) {
            folderIds.push(item.id);
            if (item.children && item.children.length > 0) {
              folderIds.push(...getAllFolderIds(item.children));
            }
          }
        });
        return folderIds;
      };

      const allFolderIds = getAllFolderIds(blogStats.directoryTree || []);
      setCollapsedFolders(new Set(allFolderIds));
    }
  }, [blogStats]);

  // 监听滚动更新活动标题
  useEffect(() => {
    if (!selectedArticle) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollContainer = document.querySelector(".custom-scrollbar") as HTMLElement;
          if (!scrollContainer) return;

          const scrollTop = scrollContainer.scrollTop;
          const containerHeight = scrollContainer.clientHeight;

          const headings = tableOfContents
            .map((item) => {
              const element = document.getElementById(item.id);
              if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                const relativeTop = rect.top - containerRect.top;
                return {
                  id: item.id,
                  top: relativeTop,
                  absoluteTop: scrollTop + relativeTop,
                  element,
                };
              }
              return null;
            })
            .filter((item): item is { id: string; top: number; absoluteTop: number; element: HTMLElement } => item !== null);

          if (headings.length === 0) return;

          const threshold = 80;
          let bestHeading = headings[0] ?? null;

          for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            if (!heading) continue;
            if (heading.top <= threshold) {
              bestHeading = heading;
            } else {
              break;
            }
          }

          if (bestHeading && bestHeading.top > threshold) {
            const visibleHeadings = headings.filter((h) => h && h.top >= 0 && h.top <= containerHeight);
            if (visibleHeadings.length > 0 && visibleHeadings[0]) {
              bestHeading = visibleHeadings[0];
            }
          }

          if (bestHeading && bestHeading.id !== activeHeading) {
            setActiveHeading(bestHeading.id);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      let timeoutId: NodeJS.Timeout;
      const debouncedHandleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, 30);
      };

      scrollContainer.addEventListener("scroll", debouncedHandleScroll);
      setTimeout(handleScroll, 100);

      return () => {
        clearTimeout(timeoutId);
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
      };
    }
  }, [selectedArticle, tableOfContents, activeHeading]);

  if (loading) {
    return (
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] font-[family-name:var(--font-geist-sans)] flex items-center justify-center relative z-20`}
      >
        <div className="loader">
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>docs - XiaoShuai&apos;s web</title>
        <meta name="description" content="分享前端开发经验和技术文章" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)] custom-scrollbar overflow-x-hidden`}
        style={{
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        {/* 导航按钮 */}
        <div className="fixed top-4 left-4 z-10 flex gap-2">
          <Link
            href="/works"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="left" width={16} height={16} color="#fff" />
            <span className="text-sm">作品集</span>
          </Link>
          <Link
            href="/"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="home" width={16} height={16} color="#fff" />
            <span className="text-sm">首页</span>
          </Link>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-8 max-w-full overflow-x-hidden">
          {/* 文章列表视图 */}
          <div
            className={`transition-all duration-300 ${
              selectedArticle ? "opacity-0 pointer-events-none absolute" : "opacity-100"
            } ${isTransitioning ? "scale-95" : "scale-100"}`}
          >
            <div className="max-w-7xl mx-auto flex gap-4 h-[80vh]">
              {/* 侧边栏：分类 + 统计 */}
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                articleCount={articles.length}
                blogStats={blogStats}
                collapsedFolders={collapsedFolders}
                onCategorySelect={setSelectedCategory}
                toggleFolder={toggleFolder}
                onFileClick={handleFileClick}
              />

              {/* 文章列表内容 */}
              <ArticleListView
                articles={articles}
                categories={categories}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchTerm}
                onCategorySelect={setSelectedCategory}
                onArticleClick={openArticle}
              />
            </div>
          </div>

          {/* 文章详情视图 */}
          {selectedArticle && (
            <ArticleDetailView
              article={selectedArticle}
              tableOfContents={tableOfContents}
              activeHeading={activeHeading}
              isTransitioning={isTransitioning}
              categories={categories}
              selectedCategory={selectedCategory}
              blogStats={blogStats}
              collapsedFolders={collapsedFolders}
              onBack={backToList}
              onHeadingClick={scrollToHeading}
              onCategorySelect={setSelectedCategory}
              toggleFolder={toggleFolder}
              onFileClick={handleFileClick}
            />
          )}
        </div>

        <div className="fixed bottom-8 right-8 z-10">
          <Link
            href="/chat"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <span className="text-sm">聊天室</span>
            <SvgIcon name="right" width={20} height={20} color="#fff" />
          </Link>
        </div>
      </div>
    </>
  );
}
