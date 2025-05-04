# Cloudflare Workers 部署指南

本文档提供了一个详细的指南，用于将基于Next.js和Cloudflare Workers的书签管理网站部署到Cloudflare Workers平台。请注意，本指南专注于通过Cloudflare网页界面引用GitHub仓库进行部署，而不使用Wrangler CLI工具。

## 准备工作

在开始部署之前，请确保完成以下准备步骤：

1. **项目完成与测试**：
   - 确保您的书签管理网站项目已经完成开发，并且在本地环境中进行了充分测试。
   - 确认所有功能（添加、删除、查看书签等）都按预期工作。

2. **代码推送至GitHub**：
   - 如果您还没有将项目代码推送到GitHub，请执行以下步骤：
     - 初始化Git仓库（如果尚未初始化）：`git init`
     - 添加所有文件：`git add .`
     - 提交更改：`git commit -m "Initial commit for Cloudflare Workers deployment"`
     - 创建一个新的GitHub仓库（在GitHub网站上）。
     - 链接本地仓库到远程仓库：`git remote add origin https://github.com/您的用户名/您的仓库名.git`
     - 推送代码：`git push -u origin main`
   - 确保您的GitHub仓库是公开的，以便Cloudflare能够访问。

## 在Cloudflare网页上部署

按照以下步骤在Cloudflare网页界面上部署您的项目：

1. **登录Cloudflare账户**：
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录您的账户。

2. **创建新的Workers项目**：
   - 在左侧导航栏中，选择“Workers & Pages”。
   - 点击“创建应用程序”按钮，然后选择“创建Worker”。
   - 为您的Worker命名，例如“bookmark-manager”，然后点击“部署”按钮（此时只是创建空的Worker）。

3. **连接GitHub仓库**：
   - 在您的Worker项目页面中，点击“设置”选项卡。
   - 在“构建与部署”部分，点击“连接到Git”按钮。
   - 选择“GitHub”作为提供商，并授权Cloudflare访问您的GitHub账户。
   - 找到并选择您之前创建的书签管理网站仓库。
   - 配置构建设置：
     - **构建命令**：`npm install && npm run build`（确保您的`package.json`中包含`build`脚本，用于构建Next.js应用）。
     - **构建输出目录**：`.next`（Next.js的默认输出目录，Cloudflare Workers将使用此目录中的文件进行部署）。
     - **环境变量**：由于项目使用了Durable Objects，您需要设置以下环境变量：
       - `NODE_ENV`：设置为`production`，以确保应用在生产模式下运行。
       - 如果有其他与Durable Objects相关的配置或API密钥，请在此添加。例如，某些情况下可能需要设置`CF_ACCOUNT_ID`和`CF_API_TOKEN`以便与Cloudflare API交互。
   - 保存设置，Cloudflare将自动开始从您的GitHub仓库构建和部署。

4. **验证部署状态**：
   - 返回到Worker的“概述”页面，查看构建和部署状态。
   - 构建成功后，您的Worker将被部署到一个类似`bookmark-manager.您的账户.workers.dev`的URL上。
   - 如果部署失败，请检查构建日志，常见问题可能包括：
     - 构建命令或输出目录设置错误。
     - 缺少必要的环境变量，导致Durable Objects无法正常工作。
     - 确保`wrangler.toml`文件中正确配置了Durable Objects的绑定和迁移（例如，`durable_objects`部分应定义对象的名称和类名）。

## 配置自定义域名（可选）

如果您希望使用自定义域名而不是默认的workers.dev子域名，请按照以下步骤操作：

1. **添加域名到Cloudflare**：
   - 在Cloudflare Dashboard中，选择您的账户，然后点击“DNS”。
   - 添加一个新的DNS记录，类型为“CNAME”，名称为您的子域名（例如，`bookmarks`），目标为您的Worker URL（例如，`bookmark-manager.您的账户.workers.dev`）。
   - 确保“代理状态”为“仅DNS”或“代理”根据您的需求。

2. **在Worker设置中绑定域名**：
   - 返回到您的Worker项目页面，点击“设置”选项卡。
   - 在“自定义域名”部分，添加您刚刚配置的域名（例如，`bookmarks.您的域名.com`）。
   - Cloudflare将自动处理SSL证书的生成和配置。

3. **测试自定义域名**：
   - 等待DNS传播完成（通常在几分钟到几小时之间）。
   - 访问您的自定义域名，确认网站正常加载。

## 测试部署后的功能

部署完成后，进行以下测试以确保一切正常运行：

1. **访问网站**：
   - 使用浏览器访问您的Worker URL或自定义域名。
   - 确认页面加载正常，所有静态资源（CSS、图片等）都正确显示。

2. **功能测试**：
   - 测试添加书签功能，确保新书签能够成功保存。
   - 测试查看书签列表，确保数据正确显示。
   - 测试删除书签功能，确保书签能够被正确移除。
   - 如果有其他功能（如编辑书签、分类等），也进行相应测试。

3. **响应性测试**：
   - 使用不同设备（手机、平板、桌面）和浏览器访问网站，确认响应式设计正常工作。

## 监控和日志查看

为了监控您的Worker性能和排查问题，请使用以下工具：

1. **Cloudflare Workers日志**：
   - 在Worker项目页面中，点击“日志”选项卡。
   - 您可以查看实时代码执行日志，了解请求处理情况和可能的错误信息。
   - 使用过滤器来筛选特定类型的日志（例如，仅错误日志）。

2. **分析与指标**：
   - 在Worker“概述”页面，查看请求量、响应时间、错误率等关键指标。
   - 使用这些数据来优化您的代码和提高性能。

3. **设置警报**：
   - 在Cloudflare Dashboard中，设置警报以便在Worker出现高错误率或性能下降时收到通知。

## 注意事项

- 本指南专门针对Cloudflare Workers部署，不适用于Cloudflare Pages。
- 每次推送代码到GitHub后，Cloudflare会自动触发新的构建和部署。
- 如果遇到部署问题，请检查构建日志，确认所有依赖都已正确安装，构建命令和输出目录设置正确。
- 对于Durable Objects的使用，确保在`wrangler.toml`中正确配置了绑定和迁移。

通过以上步骤，您应该能够成功将书签管理网站部署到Cloudflare Workers平台，并进行必要的测试和监控。如果有任何问题，请参考Cloudflare官方文档或联系支持团队。