/**
 * 主题切换工具
 */

export type ThemeType =
  | "default-blue"
  | "violet"
  | "emerald"
  | "rose"
  | "ocean"
  | "amber"
  | "indigo"
  | "cyan"
  | "forest"
  | "sunset";

export const themes: { id: ThemeType; name: string; preview: string }[] = [
  { id: "default-blue", name: "默认蓝", preview: "from-[#1b2c55] to-[#3d85a9]" },
  { id: "violet", name: "紫罗兰", preview: "from-[#5B21B6] to-[#8B5CF6]" },
  { id: "emerald", name: "翡翠绿", preview: "from-[#047857] to-[#10B981]" },
  { id: "rose", name: "玫瑰红", preview: "from-[#BE123C] to-[#FB7185]" },
  { id: "ocean", name: "海洋蓝", preview: "from-[#0EA5E9] to-[#06B6D4]" },
  { id: "amber", name: "琥珀黄", preview: "from-[#D97706] to-[#F59E0B]" },
  { id: "indigo", name: "靛青紫", preview: "from-[#3730A3] to-[#6366F1]" },
  { id: "cyan", name: "青色", preview: "from-[#0891B2] to-[#06B6D4]" },
  { id: "forest", name: "森林绿", preview: "from-[#14532D] to-[#22C55E]" },
  { id: "sunset", name: "落日橙", preview: "from-[#DC2626] to-[#F97316]" },
];

const THEME_STORAGE_KEY = "blog-theme";

/**
 * 获取当前主题
 */
export function getCurrentTheme(): ThemeType {
  if (typeof window === "undefined") return "default-blue";
  return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeType) || "default-blue";
}

/**
 * 设置主题
 */
export function setTheme(theme: ThemeType) {
  // 移除所有主题 data 属性
  themes.forEach((t) => {
    document.documentElement.removeAttribute(`data-theme-${t.id}`);
  });

  // 添加新主题 data 属性
  document.documentElement.setAttribute(`data-theme`, theme);

  // 同时设置到 body 确保覆盖
  document.body.setAttribute(`data-theme`, theme);

  // 保存到本地存储
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * 初始化主题
 */
export function initTheme() {
  const theme = getCurrentTheme();
  setTheme(theme);
}

/**
 * 获取下一个主题
 */
export function getNextTheme(currentTheme: ThemeType): ThemeType {
  const currentIndex = themes.findIndex((t) => t.id === currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  return themes[nextIndex].id;
}
