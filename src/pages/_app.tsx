import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import CommentModal from "@/components/CommentModal";
import { useState, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import { initTheme } from "@/lib/theme";
import {
  commentAPI,
  reactionAPI,
  ReactionType,
  ReactionCounts,
} from "../../service/api/comment";
import { useRouter } from "next/router";

// 布局组件，包含公共的主题切换和背景
function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const router = useRouter();

  // 初始化主题
  useEffect(() => {
    initTheme();
  }, []);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isReactionMenuOpen, setIsReactionMenuOpen] = useState(false);

  const [commentCount, setCommentCount] = useState(0);
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    like: 0,
    cheer: 0,
    celebrate: 0,
    appreciate: 0,
    smile: 0,
  });
  const [hasReacted, setHasReacted] = useState<Record<ReactionType, boolean>>({
    like: false,
    cheer: false,
    celebrate: false,
    appreciate: false,
    smile: false,
  });

  // 添加谢谢你动画状态
  const [showThanks, setShowThanks] = useState<Record<ReactionType, boolean>>({
    like: false,
    cheer: false,
    celebrate: false,
    appreciate: false,
    smile: false,
  });

  // 加载评论数量和点赞数量
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [commentsData, reactionsData] = await Promise.all([
          commentAPI.getComments(),
          reactionAPI.getReactions(),
        ]);
        setCommentCount(commentsData.length);
        setReactionCounts(reactionsData);

        // 检查本地存储是否已点赞
        const reacted: Record<ReactionType, boolean> = {
          like: localStorage.getItem("hasReacted_like") === "true",
          cheer: localStorage.getItem("hasReacted_cheer") === "true",
          celebrate: localStorage.getItem("hasReacted_celebrate") === "true",
          appreciate: localStorage.getItem("hasReacted_appreciate") === "true",
          smile: localStorage.getItem("hasReacted_smile") === "true",
        };
        setHasReacted(reacted);
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    };

    loadCounts();
  }, []);

  // 处理点赞
  const handleReaction = async (type: ReactionType) => {
    if (hasReacted[type]) return;

    try {
      const result = await reactionAPI.addReaction(type);
      setReactionCounts((prev) => ({
        ...prev,
        [type]: result.count,
      }));
      setHasReacted((prev) => ({
        ...prev,
        [type]: true,
      }));
      localStorage.setItem(`hasReacted_${type}`, "true");

      // 显示谢谢你动画
      setShowThanks((prev) => ({
        ...prev,
        [type]: true,
      }));

      // 1秒后隐藏动画
      setTimeout(() => {
        setShowThanks((prev) => ({
          ...prev,
          [type]: false,
        }));
      }, 2000);
    } catch (error) {
      console.error("点赞失败:", error);
    }
  };

  const handleCommentClick = () => {
    setIsCommentOpen(true);
  };

  // 格式化评论数量显示
  const formatCount = (count: number) => {
    return count > 99 ? "99+" : count.toString();
  };

  const isChatPage = router.pathname === "/chat";

  return (
    <div className="relative min-h-screen">
      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 配色主题切换器 */}
      <ThemeSwitcher />

      {/* 浅色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1]"
        style={{
          backgroundImage: `url('/images/light.png')`,
          opacity: theme === "light" ? 1 : 0,
        }}
      />

      {/* 深色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1]"
        style={{
          backgroundImage: `url('/images/dark.jpg')`,
          opacity: theme === "dark" ? 1 : 0,
        }}
      />

      {/* 反应按钮 - 一行左侧展开动画 */}
      {!isChatPage && (
        <div className="fixed bottom-32 right-8 z-50">
          <div className="relative flex items-center">
            {/* 一行展开的反应按钮容器（在开关按钮左侧，不遮挡右侧/下方） */}
            <div
              className={`
          absolute right-16 bottom-1/2 translate-y-1/2
          flex items-center gap-3
          transition-all duration-300 ease-out
          ${
            isReactionMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
            >
              {[
                {
                  type: "smile" as ReactionType,
                  emoji: "🙂",
                  label: "Smile",
                  floatClass: "animate-float-0",
                },
                {
                  type: "appreciate" as ReactionType,
                  emoji: "✨",
                  label: "Appreciate",
                  floatClass: "animate-float-50",
                },
                {
                  type: "celebrate" as ReactionType,
                  emoji: "🎉",
                  label: "Celebrate",
                  floatClass: "animate-float-100",
                },
                {
                  type: "cheer" as ReactionType,
                  emoji: "👏🏻",
                  label: "Cheer",
                  floatClass: "animate-float-150",
                },
                {
                  type: "like" as ReactionType,
                  emoji: "👍",
                  label: "Like",
                  floatClass: "animate-float-200",
                },
              ].map(({ type, emoji, label, floatClass }, index) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  disabled={hasReacted[type]}
                  className={`
              group relative
              transition-all duration-500 ease-out
              ${hasReacted[type] ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
                  style={{
                    // 依次弹出节奏
                    transitionDelay: `${index * 70}ms`,
                    // ✅ 滑入：从右往左滑入（因为按钮在左侧排列，滑入方向要从开关按钮“出来”）
                    transform: isReactionMenuOpen
                      ? "translateX(0px) translateY(0px) scale(1)"
                      : "translateX(18px) translateY(6px) scale(0.85)",
                  }}
                >
                  <div
                    className={`
                relative bg-white/90 dark:bg-[#2a2a2a]/90
                backdrop-blur-sm shadow-xl
                rounded-full w-13 h-13
                flex items-center justify-center
                transition-all duration-300
                hover:shadow-2xl hover:scale-110 hover:bg-white dark:hover:bg-[#333]
                ${hasReacted[type] ? "ring-2 ring-green-500 ring-opacity-50" : ""}
                ${floatClass}
              `}
                  >
                    {/* emoji 微调：视觉居中更舒服 */}
                    <span className="text-2xl -translate-y-0.5">{emoji}</span>

                    {/* 悬浮提示 */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/80 dark:bg-white/90 dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                      {label}{" "}
                      {reactionCounts[type] > 0 &&
                        `(${formatCount(reactionCounts[type])})`}
                    </div>

                    {/* 谢谢你动画 */}
                    {showThanks[type] && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="text-white text-sm font-bold whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-full shadow-lg animate-pulse">
                          谢谢你 ❤️
                        </div>
                      </div>
                    )}

                    {/* 反应数量徽章 */}
                    {reactionCounts[type] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                        {formatCount(reactionCounts[type])}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 主触发按钮 */}
            <button
              onClick={() => setIsReactionMenuOpen(!isReactionMenuOpen)}
              aria-label={
                isReactionMenuOpen ? "Close reactions" : "Open reactions"
              }
              className={`
                  relative group z-10
                  bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500
                  hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600
                  text-white shadow-xl hover:shadow-2xl
                  rounded-full w-14 h-14
                  flex items-center justify-center
                  transition-all duration-300 ease-out
                  hover:scale-110 active:scale-95
                  ${isReactionMenuOpen ? "rotate-45" : "rotate-0"}
                `}
            >
              {/* ✅ 优化关闭叉号：不用 ✕ 字符，改成两条线组成的 X，更居中、更清晰 */}
              <span className="relative block w-6 h-6">
                {/* 打开态显示笑脸 */}
                <span
                  className={`
              absolute inset-0 flex items-center justify-center text-2xl
              transition-all duration-200
              ${isReactionMenuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"}
            `}
                >
                  😊
                </span>

                {/* 关闭态显示叉号（两条线），并且不受字体影响 */}
                <span
                  className={`
              absolute inset-0
              transition-all duration-200
              ${isReactionMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"}
            `}
                >
                  <span className="absolute left-1/2 top-1/2 w-6 h-[2px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full rotate-90" />
                  <span className="absolute left-1/2 top-1/2 w-6 h-[2px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
                </span>
              </span>

              {/* 波纹动画 */}
              <span
                className={`
            absolute inset-0 rounded-full bg-white/30
            ${isReactionMenuOpen ? "animate-ping" : ""}
          `}
              />
            </button>
          </div>
        </div>
      )}

      {/* 评论按钮 */}
      {!isChatPage && (
        <button
          onClick={handleCommentClick}
          className={`
          fixed bottom-52 right-10 z-10
          bg-[#5D676B] hover:bg-[#2C363F] text-white
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          flex items-center justify-center cursor-pointer w-12 h-12 rounded-full 
        `}
        >
          <SvgIcon name="comment" width={20} height={20} color="#fff" />
          <span className="text-[11px] flex items-center justify-center font-medium absolute right-[-15px] top-0 bg-[#2C363F] w-[25px] h-[25px] rounded-full">
            {formatCount(commentCount)}
          </span>
        </button>
      )}
      {/* 评论弹窗 */}
      <CommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />

      {/* 页面内容 */}
      {children}
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 模拟加载时间，2.5秒后开始淡出动画
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      // 淡出动画持续 500ms（与 CSS transition 一致）
      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {/* 全局加载动画 */}
      <LoadingAnimation isVisible={isLoading} isAnimatingOut={isAnimatingOut} />

      {/* 布局组件包装页面内容 */}
      <div className={showContent ? "animate-fade-in" : "opacity-0"}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ThemeProvider>
  );
}
