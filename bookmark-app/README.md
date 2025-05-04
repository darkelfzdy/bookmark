# Bookmark App - Next.js 项目

## 项目结构
```
/home/coder/project/bookmark
└── bookmark-app/
    ├── app/                  # Next.js应用路由
    ├── components/           # React组件
    ├── lib/                  # 数据库和初始化脚本
    ├── public/               # 静态资源
    └── src/app/              # 应用入口
```

## 开发指南

### 本地开发
```bash
cd /home/coder/project/bookmark/bookmark-app
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## Vercel 部署配置

### 1. 项目设置
- **框架预设**: Next.js
- **根目录**: `/bookmark-app` (不是项目根目录)
- **构建命令**: `npm run build`
- **输出目录**: `.next` (不是/bookmark-app/.next)

### 2. 环境变量配置
重要安全操作指南:

1. 从GitHub删除.env.local:
```bash
# 确保文件已提交到.gitignore
git rm --cached .env.local
git commit -m "Remove .env.local from repository"
git push
```

2. Vercel环境变量配置:
- Vercel部署时会优先使用其平台设置的环境变量
- 即使没有.env文件，只要在Vercel中正确配置就能正常工作
- 配置步骤:
  a. 登录Vercel → 项目 → Settings → Environment Variables
  b. 添加:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
  c. 值从Supabase控制台获取(项目设置 → API)

3. 本地开发:
- 保留本地.env.local(不上传)
- 内容示例:
```
NEXT_PUBLIC_SUPABASE_URL=你的URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Key
```

### 3. 部署步骤
1. 连接你的Git仓库
2. 确保选择正确的框架预设(Next.js)
3. 设置根目录为`bookmark-app`
4. 添加所需环境变量
5. 点击部署

## 项目技术栈
- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (数据库ORM)

## 了解更多
- [Next.js文档](https://nextjs.org/docs)
- [Vercel部署指南](https://vercel.com/docs)
