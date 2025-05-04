# 书签管理网站部署指南

本文档提供将书签管理网站部署到Cloudflare Pages的详细步骤。遵循以下指南，您可以轻松完成应用的部署和运行。

## 1. 连接Git仓库

1. **登录Cloudflare账户**：访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录您的账户。
2. **导航到Pages**：在左侧菜单中选择“Pages”。
3. **创建新项目**：点击“Create a project”按钮。
4. **连接Git仓库**：
   - 选择“Connect to Git”选项。
   - 如果您还没有连接Git账户，选择您的Git服务提供商（如GitHub、GitLab等），并按照提示授权Cloudflare访问您的仓库。
   - 从列表中选择您的书签管理网站仓库（例如：`bookmark-manager`）。
   - 点击“Begin setup”按钮。

## 2. 设置构建命令和输出目录

在项目设置页面中，配置以下内容：

1. **项目名称**：输入一个名称，例如`bookmark-manager`。
2. **生产分支**：通常选择`main`或`master`分支。
3. **构建设置**：
   - **框架预设**：建议保持为空。选择`Next.js`作为框架预设可能会导致构建命令和输出目录自动更改为不符合项目配置的设置（如构建命令变为`npx @cloudflare/next-on-pages@1`，输出目录变为`.vercel/output/static`）。
   - **构建命令**：输入`npm run build`。
   - **构建输出目录**：输入`.next`。
   - **如果已选择Next.js预设**：如果您已经选择了`Next.js`作为框架预设，请手动调整构建命令为`npm run build`，输出目录为`.next`，以确保与项目配置一致。
4. 点击“Save and Deploy”按钮开始首次部署。Cloudflare会自动拉取代码、构建并部署您的应用。

## 3. 创建Durable Object Namespace

为了让应用能够持久化存储书签数据，您需要在Cloudflare Dashboard中创建Durable Object Namespace。以下是详细步骤：

1. **导航到Workers & Pages**：在Cloudflare Dashboard左侧菜单中选择“Workers & Pages”。
2. **进入Durable Objects选项**：
   - 在“Workers & Pages”页面中，点击左侧菜单中的“Durable Objects”选项。如果您没有看到此选项，请确保您已启用Workers功能（可以通过账户设置或计划升级启用）。
3. **创建Namespace**：
   - 在“Durable Objects”页面中，点击“Create namespace”按钮。
   - 输入一个名称，例如`bookmarks-namespace`。名称应简洁且能反映用途。
   - 点击“Create”完成创建。
4. 记下创建的Namespace ID，稍后会用到。您可以在“Durable Objects”页面中找到此ID。

## 4. 添加Durable Object绑定

在Cloudflare Pages项目设置中，将Durable Object绑定到您的应用：

1. **导航到Pages项目设置**：在Cloudflare Dashboard中，选择您的Pages项目（例如`bookmark-manager`），然后点击“Settings”。
2. **环境变量和绑定**：在设置页面中，找到“Environment Variables & Bindings”部分。
3. **添加绑定**：
   - 点击“Add binding”按钮。
   - **Binding Name**：输入`BOOKMARKS`。
   - **Type**：选择“Durable Object Namespace”。
   - **Namespace**：选择您之前创建的Namespace（例如`bookmarks-namespace`）。
4. 点击“Save”保存设置。

## 5. 部署后测试

完成上述步骤后，您的书签管理网站应该已经成功部署到Cloudflare Pages提供的`*.pages.dev`域名上。进行以下测试以确保一切正常：

1. **访问网站**：在浏览器中打开您的网站域名（例如`bookmark-manager.pages.dev`）。
2. **添加书签**：使用界面添加一个新的书签，填写标题和URL，然后点击保存。
3. **删除书签**：尝试删除一个已添加的书签，确认删除操作成功。
4. **刷新页面**：刷新浏览器页面，确认添加的书签仍然存在，验证数据持久性。

如果以上测试都通过，恭喜您！您的书签管理网站已经成功部署并运行在Cloudflare Pages上。

## 注意事项

- 如果在部署过程中遇到问题，请检查Cloudflare Dashboard中的“Deployments”页面，查看详细的构建日志以排查错误。
- 确保您的Git仓库中的代码是最新的，并且所有更改都已提交和推送。

如需进一步帮助，请参考Cloudflare官方文档或联系支持团队。