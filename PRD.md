# 书签管理网站 PRD 文档

## 1. 项目概述
基于Next.js和Cloudflare Workers的简易书签管理网站，使用Durable Objects实现数据持久化，作为技术验证原型。项目将部署到Cloudflare Workers，通过GitHub仓库自动部署方式实现。

## 2. 功能需求
### 2.1 核心功能
- 添加书签（URL+标题），添加后显示在书签列表中
- 删除书签列表中的书签
- 展示书签列表

### 2.2 用户界面
- 简洁的书签列表视图（自带www.baidu.com（百度）和www.qidian.com（起点）两个网站）
- 添加书签按钮
- 每个书签带删除按钮

## 3. 非功能需求
- 前端部署到Cloudflare Workers（非Pages）
- 使用Durable Objects持久化数据
- 支持现代浏览器

## 4. 项目架构

### 4.1 整体架构
单一Cloudflare Worker项目，包含前端(Next.js)和后端(Durable Objects)的所有代码。

### 4.2 项目结构
```
/
├── src/
│   ├── index.js          - Worker入口文件，处理HTTP请求和静态资源服务
│   ├── bookmark.js       - Durable Object类定义，处理书签数据持久化
│   └── components/       - Next.js组件
│       ├── BookmarkList.jsx     - 书签列表组件
│       ├── BookmarkItem.jsx     - 单个书签组件
│       └── AddBookmarkForm.jsx  - 添加书签表单
├── pages/
│   └── index.js          - Next.js主页
├── public/               - 静态资源
├── next.config.js        - Next.js配置
├── wrangler.toml         - Cloudflare Workers配置
├── package.json          - 项目依赖
└── .gitignore            - Git忽略文件
```

### 4.3 数据流
1. **获取书签**:
   - 浏览器加载Next.js前端应用
   - 前端应用通过API请求获取书签
   - Worker接收请求并转发给Durable Object
   - Durable Object返回书签数据
   - 前端渲染书签列表

2. **添加书签**:
   - 用户填写并提交添加书签表单
   - 前端发送POST请求
   - Worker接收请求并转发给Durable Object
   - Durable Object存储新书签
   - 前端更新书签列表

3. **删除书签**:
   - 用户点击书签的删除按钮
   - 前端发送DELETE请求
   - Worker接收请求并转发给Durable Object
   - Durable Object删除对应书签
   - 前端更新书签列表

### 4.4 API端点
```
GET /api/bookmarks        - 获取所有书签
POST /api/bookmarks       - 添加新书签
DELETE /api/bookmarks/:id - 删除特定书签
```

### 4.5 Durable Objects数据模型
```javascript
{
  bookmarks: [
    {
      id: "unique-id-1",
      url: "https://www.baidu.com",
      title: "百度"
    },
    {
      id: "unique-id-2",
      url: "https://www.qidian.com",
      title: "起点"
    }
    // 更多书签...
  ]
}
```

## 5. 开发与测试流程

### 5.1 开发环境设置
1. 安装Node.js和npm
2. 安装项目依赖
   - Next.js
   - React
   - 其他必要依赖
3. 设置开发脚本(package.json)

### 5.2 本地开发步骤
1. **前端开发**:
   - 实现书签列表、添加书签表单和删除功能
   - 可以使用模拟数据进行前端开发和测试

2. **Worker和Durable Objects开发**:
   - 开发Worker处理HTTP请求的逻辑
   - 实现Durable Objects类处理数据持久化
   - 定义API端点处理书签的CRUD操作

### 5.3 本地测试
1. 使用`wrangler`进行本地测试
   ```
   wrangler dev
   ```
2. 在浏览器中访问本地开发服务器
3. 测试书签添加、删除和显示功能

### 5.4 分步测试策略
1. **静态前端测试**:
   - 确保前端页面正确加载
   - 验证UI元素是否正确显示
   - 测试表单输入和按钮点击事件

2. **API功能测试**:
   - 测试获取书签列表API
   - 测试添加新书签API
   - 测试删除书签API

3. **集成测试**:
   - 测试前端通过API添加书签
   - 测试前端通过API删除书签
   - 测试页面刷新后数据持久化

## 6. 部署流程

### 6.1 GitHub仓库设置
1. 创建新的GitHub仓库
2. 添加适当的`.gitignore`文件
3. 初始化本地Git仓库并连接到GitHub

### 6.2 代码提交与推送
1. 完成代码开发后提交到本地仓库
2. 推送代码到GitHub远程仓库

### 6.3 Cloudflare Workers设置
1. 在Cloudflare Workers控制台创建新项目
2. 选择"Connect to GitHub"选项
3. 授权Cloudflare访问GitHub仓库
4. 选择包含书签管理应用的仓库
5. 配置构建设置和环境变量
6. 生成一个完成的Cloudflare workers部署说明

### 6.4 自动部署
每次推送到GitHub仓库时，Cloudflare将自动:
- 拉取最新代码
- 运行构建过程
- 部署更新后的Worker

### 6.5 部署后验证
1. 访问部署后的应用URL
2. 验证所有功能是否正常工作
3. 检查Cloudflare控制台中的日志和错误报告

## 7. 问题排查指南

### 7.1 前端显示问题
- 检查浏览器控制台是否有错误
- 验证Next.js构建是否成功
- 确认静态资源是否正确加载

### 7.2 API问题
- 检查网络请求是否返回正确状态码
- 查看Cloudflare Workers日志
- 验证请求和响应格式

### 7.3 Durable Objects问题
- 确认Durable Objects绑定配置正确
- 检查数据存储和检索逻辑
- 验证ID生成和管理

### 7.4 部署问题
- 检查GitHub Actions或Cloudflare构建日志
- 确认`wrangler.toml`配置正确
- 验证所有必要的环境变量已设置

## 8. 注意事项
- 项目已完成git初始化，但未安装任何依赖
- 需要生成适当的.gitignore文件
- 不使用open命令
- 针对非技术人员的分步测试说明，便于问题排查