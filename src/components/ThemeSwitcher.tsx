import { useState, useEffect } from "react";
import SvgIcon from "./SvgIcon";
import { themes, type ThemeType, setTheme, getCurrentTheme } from "@/lib/theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("default-blue");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleThemeChange = (themeId: ThemeType) => {
    setCurrentTheme(themeId);
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-[3.5rem] right-4 md:top-4 md:right-[4.5rem] z-20">
      <div className="relative">
        {/* 主题切换按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 opacity-80 ${
            theme === "dark"
              ? "bg-[#303136] hover:bg-[#404146]"
              : "bg-[#f4f4f5] hover:bg-[#e4e4e7]"
          }`}
          style={{ width: "3em", height: "1.5em" }}
          title="选择主题"
        >
          <SvgIcon
            name="theme"
            width={16}
            height={16}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </button>

        {/* 主题选择面板 */}
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-0 bg-black/30"
              onClick={() => setIsOpen(false)}
            />

            {/* PC端：向下显示 */}
            <div className="hidden md:block absolute top-full right-0 mt-2 bg-[var(--black-medium)] rounded-xl p-2.5 border border-[var(--white-medium)] backdrop-blur-sm shadow-2xl z-50 animate-slide-down">
              <div className="flex gap-1.5">
                {themes.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative group flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-200 ${
                        isActive ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                      title={theme.name}
                    >
                      {/* 主题预览色块 - 圆形渐变 */}
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.preview} ${
                          isActive
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--black-medium)]"
                            : ""
                        }`}
                      />
                      {/* 选中指示器 */}
                      {isActive && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--primary-end)] flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={4}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      {/* 主题名称 - 选中始终显示，未选中悬停显示 */}
                      <span className={`text-[10px] text-gray-300 transition-opacity whitespace-nowrap ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 移动端：抽屉从下往上 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--black-medium)] rounded-t-3xl p-4 border-t border-[var(--white-medium)] backdrop-blur-sm shadow-2xl z-50 animate-slide-up max-h-[60vh] overflow-y-auto">
              {/* 拖拽指示条 */}
              <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-3 opacity-50" />

              <h3 className="text-white text-sm font-bold mb-3 text-center">
                选择主题配色
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {themes.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200 ${
                        isActive ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      {/* 主题预览色块 - 圆形渐变 */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.preview} ${
                          isActive
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--black-medium)]"
                            : ""
                        }`}
                      />
                      {/* 主题名称 */}
                      <span
                        className={`text-[10px] font-medium ${
                          isActive
                            ? "text-[var(--primary-end)]"
                            : "text-gray-300"
                        }`}
                      >
                        {theme.name}
                      </span>
                      {/* 选中指示器 */}
                      {isActive && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--primary-end)] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={4}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
