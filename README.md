<p align="center">
  <img src="/images/dark.jpg" alt="XiaoShuai" width="120" />
</p>

<h1 align="center">XiaoShuai's Blog</h1>

<p align="center">
  <a href="https://github.com/Max-Samson" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Max--Samson-blue" alt="GitHub" />
  </a>
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Next.js-15.3.5-black" alt="Next.js" />
  </a>
  <a href="https://react.dev/" target="_blank">
    <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
  </a>
</p>

## Introduction

欢迎来到我的个人网站！这是一个使用 Next.js + React + TypeScript + Prisma + Pusher 构建的现代博客网站。

**Welcome to my personal website! This is a modern blog built with Next.js + React + TypeScript + Prisma + Pusher.**

### 功能特性 | Features

- 🎨 **主题切换** - 支持明暗主题切换
- 📝 **博客系统** - Markdown 文章管理，代码高亮
- 💬 **评论系统** - 支持嵌套回复的评论功能
- 👍 **点赞互动** - 多种类型的点赞反馈
- 💬 **实时聊天** - 基于 Pusher 的实时聊天室
- 📊 **GitHub 热力图** - 展示代码提交活动
- 📱 **响应式设计** - 完美适配移动端
- ⚡ **性能优化** - 数据库重试机制，缓存策略

## Technology Stack

| 技术         | 版本   | 说明              |
| ------------ | ------ | ----------------- |
| Next.js      | 15.3.5 | React 框架        |
| React        | 19.0.0 | UI 库             |
| TypeScript   | 5.0+   | 类型安全          |
| Tailwind CSS | 4      | 样式框架          |
| Prisma       | 6.13.0 | ORM               |
| Pusher       | 5.2.0  | 实时通信          |
| Neon         | -      | PostgreSQL 数据库 |

## Node Version

```
node: v20.10.0
pnpm: 8.8.0
```

## Getting Started

```bash
# 克隆项目
git clone https://github.com/Max-Samson/BlogWeb.git

# 进入项目目录
cd BlogWeb

# 安装依赖
pnpm i

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看网站

## Project Structure

```
BlogWeb/
├── prisma/              # Prisma 配置
│   └── schema.prisma    # 数据库模型定义
├── public/              # 静态资源
│   └── images/         # 图片资源
├── scripts/            # 工具脚本
│   ├── generate-count.js  # 博客统计生成
│   └── watch-blogs.js     # 博客文件监听
├── service/            # API 服务封装
├── src/
│   ├── blogs/          # Markdown 文章
│   ├── components/     # React 组件
│   │   ├── CommentModal.tsx
│   │   ├── GitHubHeatmap.tsx
│   │   ├── ImageModal.tsx
│   │   ├── LoadingAnimation.tsx
│   │   ├── MusicModal.tsx
│   │   ├── SvgIcon.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── VideoModal.tsx
│   ├── contexts/       # React Context
│   │   └── ThemeContext.tsx
│   ├── data/           # 数据文件
│   │   ├── experience.ts    # 经历数据
│   │   ├── tagConfigs.ts    # 标签配置
│   │   └── works.ts         # 作品数据
│   ├── lib/            # 工具库
│   │   ├── prisma.ts        # Prisma 客户端
│   │   └── pusher.ts        # Pusher 客户端
│   ├── pages/          # Next.js 页面
│   │   ├── _app.tsx         # 应用入口
│   │   ├── _document.tsx    # 文档结构
│   │   ├── index.tsx        # 首页
│   │   ├── blog.tsx         # 博客页
│   │   ├── chat.tsx         # 聊天室
│   │   ├── works.tsx        # 作品页
│   │   └── api/             # API 路由
│   │       ├── blog-stats.ts
│   │       ├── blogs.ts
│   │       ├── chat/
│   │       ├── comments.ts
│   │       ├── pusher/
│   │       └── reactions.ts
│   └── styles/         # 样式文件
│       └── globals.css
├── .env                # 环境变量
├── next.config.ts      # Next.js 配置
├── package.json        # 项目依赖
└── tsconfig.json       # TypeScript 配置
```

## Environment Variables

创建 `.env` 文件并配置以下变量：

```env
# Neon PostgreSQL 数据库
DATABASE_URL="postgresql://user:password@host/db?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"

# Pusher 实时通信
NEXT_PUBLIC_PUSHER_APP_ID="your-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_HOST="your-host"
```

## Deployment

### Vercel 部署

1. 创建 [Vercel](https://vercel.com/) 账号
2. 连接 GitHub 仓库
3. 配置环境变量
4. 部署项目

### 数据库配置

1. 创建 [Neon](https://neon.com/) 数据库
2. 运行 `pnpm run push-db` 同步数据库结构
3. 运行 `pnpm run generate` 生成 Prisma 客户端

### Pusher 配置

1. 创建 [Pusher](https://pusher.com/) 账号
2. 创建应用并获取密钥
3. 配置 `.env` 文件

## Scripts

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm count        # 生成博客统计
pnpm watch-blogs  # 监听博客文件变化
pnpm push-db      # 同步数据库结构
pnpm generate     # 生成 Prisma 客户端
```

## Tips

1. 如果修改表结构，则需要重新运行 `pnpm run push-db` 命令，将数据库结构推送到 neon 上
2. 上传到您的 github 仓库时，请将.env 文件添加到.gitignore 文件中
3. 这个只是基础模板，各位发挥自己的想象创造力打造吧！
4. 如果遇到不懂的，请在 qq 群内联系我: 916088073

## Contributing

欢迎提交 Issue 和 Pull Request！

## License

MIT License

---

> [!NOTE]
> 如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
>
> If you find this project helpful, please give it a ⭐️!
