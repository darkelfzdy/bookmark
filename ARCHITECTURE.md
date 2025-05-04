# 书签网站架构设计文档

## 1. 项目结构
```
bookmark-app/
├── app/
│   ├── api/
│   │   └── bookmarks/
│   │       ├── route.ts (GET)
│   │       ├── route.ts (POST)
│   │       └── [id]/
│   │           └── route.ts (DELETE)
├── components/
│   ├── BookmarkList.tsx
│   └── AddBookmarkForm.tsx
├── lib/
│   └── db.ts
├── public/
├── styles/
└── .env.local
```

## 2. 数据库设计
```sql
CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. API接口
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/bookmarks | 获取所有书签 |
| POST | /api/bookmarks | 添加新书签 |
| DELETE | /api/bookmarks/[id] | 删除书签 |

## 4. 环境变量
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. 部署方案
- **Vercel**: 部署Next.js应用
- **Supabase**: 托管PostgreSQL数据库