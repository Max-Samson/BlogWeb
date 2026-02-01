# Blog 组件架构文档

## 📁 组件结构

```
src/components/blog/
├── Sidebar.tsx              # 侧边栏组件（分类 + 统计面板）
├── TableOfContents.tsx      # 目录组件（仅 MD 文件显示）
├── ArticleListView.tsx      # 文章列表视图
├── ArticleDetailView.tsx    # 文章详情视图容器
├── PdfArticleView.tsx      # PDF 文件专用视图
├── MdArticleView.tsx       # Markdown 文件专用视图
├── MarkdownRenderer.tsx    # Markdown 渲染器（代码高亮 + 复制）
├── DirectoryTreeItem.tsx   # 目录树组件
├── TypewriterText.tsx      # 打字机动画组件
└── README.md               # 本文档
```

## 🔄 数据流向

```
blog.tsx (主组件 - 布局协调)
    │
    ├── 数据层 (hooks)
    │   ├── useBlogArticles → 加载文章/统计数据
    │   └── useBlogNavigation → 处理导航/文件点击
    │
    ├── 列表视图
    │   ├── Sidebar (侧边栏)
    │   │   ├── 分类面板
    │   │   └── 统计面板
    │   └── ArticleListView
    │       ├── TypewriterText (打字机)
    │       ├── 搜索框
    │       └── 文章卡片列表
    │
    └── 详情视图
        ├── Sidebar (侧边栏)
        ├── PdfArticleView (PDF 文件) 或
        ├── MdArticleView (MD 文件)
        └── TableOfContents (仅 MD 文件)
```

## 📦 组件说明

### 1. Sidebar.tsx
**职责**: 统一的侧边栏组件，包含分类面板和统计面板

**使用位置**:
- 文章列表视图
- 文章详情视图

**特性**:
- 分类筛选（支持文章数量显示）
- 博客统计（总文章数、目录数、文件数）
- 分类统计（带进度条）
- 目录结构树（支持文件夹折叠）

---

### 2. TableOfContents.tsx
**职责**: 显示 Markdown 文件的目录

**使用条件**: 仅当文件类型为 `.md` 且有标题时显示

**特性**:
- 响应式设计（移动端折叠/桌面端展开）
- 滚动时高亮当前标题
- 点击跳转到对应章节

---

### 3. ArticleListView.tsx
**职责**: 文章列表视图

**包含**:
- 打字机动画标题
- 搜索框
- 移动端分类 tabs
- 文章卡片列表
- 回到顶部按钮

---

### 4. ArticleDetailView.tsx
**职责**: 文章详情容器，根据文件类型选择渲染方式

**逻辑**:
```typescript
const isPdf = article.filename?.toLowerCase().endsWith(".pdf");
const showTableOfContents = !isPdf && tableOfContents.length > 0;
```

**布局**:
- 左侧: Sidebar (分类 + 统计)
- 中间: PdfArticleView 或 MdArticleView
- 右侧: TableOfContents (仅 MD) 或 文档信息 (仅 PDF)

---

### 5. PdfArticleView.tsx
**职责**: PDF 文件专用视图

**功能**:
- 显示返回按钮
- 显示文章头部信息
- 使用 PdfViewer 组件渲染 PDF

---

### 6. MdArticleView.tsx
**职责**: Markdown 文件专用视图

**功能**:
- 显示返回按钮
- 显示文章头部信息
- 使用 MarkdownRenderer 渲染内容

---

### 7. MarkdownRenderer.tsx
**职责**: Markdown 内容渲染器

**功能**:
- 解析 Markdown 语法（标题、段落、代码块）
- 代码语法高亮（使用 react-syntax-highlighter）
- 代码复制功能
- Toast 提示

**支持的语法**:
- 标题: `#`, `##`, `###`
- 代码块: ` ```language `
- 段落: 普通文本
- 空行: `<br>`

---

### 8. DirectoryTreeItem.tsx
**职责**: 目录树组件（递归）

**功能**:
- 显示文件夹/文件图标
- 文件夹折叠/展开
- 文件点击事件处理

**图标映射**:
- 文件夹: 📁
- PDF 文件: 📕
- MD 文件: 📄

---

### 9. TypewriterText.tsx
**职责**: 打字机动画效果

**功能**:
- 逐字输入动画
- 关键词高亮（"前端"）
- 循环播放

---

## 🎯 文件类型处理

| 文件类型 | 目录显示 | 渲染组件 | 说明 |
|---------|---------|---------|------|
| `.md` | ✅ 显示 | MdArticleView + MarkdownRenderer | 解析标题生成目录 |
| `.pdf` | ❌ 不显示 | PdfArticleView | PDF 预览，右侧显示文档信息 |

## 🔧 如何添加新功能

### 添加新的 Markdown 语法支持

编辑 `MarkdownRenderer.tsx` 中的 `renderMarkdown` 函数。

### 修改 PDF 预览样式

编辑 `PdfArticleView.tsx` 或 `@/components/PdfViewer.tsx`。

### 添加新的侧边栏功能

编辑 `Sidebar.tsx` 组件。

### 修改目录样式

编辑 `TableOfContents.tsx` 组件。

## 📝 注意事项

1. **PDF 文件不生成目录** - PDF 没有标题信息，所以右侧显示的是简化的文档信息面板
2. **侧边栏可复用** - Sidebar 在列表视图和详情视图都可以使用
3. **类型安全** - 所有组件都有完整的 TypeScript 类型定义
4. **状态管理** - 使用 hooks 集中管理数据，避免 prop drilling
