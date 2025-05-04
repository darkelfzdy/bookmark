**项目需求文档 (PRD): 简易书签管理网站 (技术验证原型)**

**版本:** 1.0
**日期:** 2025年5月4日

## 1. 项目概述

本项目旨在开发一个基于Next.js前端框架和Cloudflare Pages部署平台的简易书签管理网站。其核心目标是作为**技术验证原型**，探索使用Cloudflare Pages Functions与Cloudflare Durable Objects (DO) 结合实现数据持久化的可行性。应用将提供基本的书签添加、删除和展示功能，并采用极简的用户界面。

## 2. 项目目标与范围

*   **目标:**
    *   成功构建一个功能完整的、端到端的Web应用，使用指定的技术栈。
    *   验证通过Pages Functions与Durable Objects交互进行数据读写的流程。
    *   提供一个可在本地和Cloudflare Pages上运行和测试的基础应用。
*   **范围:**
    *   仅实现核心的书签CRUD（创建、读取、删除）功能。
    *   所有用户共享同一个书签列表（无用户认证或隔离）。
    *   用户界面保持最低限度的简洁性。
    *   重点在于后端与数据持久化机制的实现与验证。

## 3. 功能需求

### 3.1 核心功能
*   **添加书签:**
    *   用户可以输入URL和对应的标题。
    *   点击“添加”按钮后，新的书签应被持久化存储。
    *   添加成功后，新的书签应立即显示在书签列表中。
*   **删除书签:**
    *   列表中的每个书签旁边应有一个“删除”按钮。
    *   点击“删除”按钮后，对应的书签应从持久化存储中移除。
    *   删除成功后，该书签应从界面列表中消失。
*   **展示书签列表:**
    *   页面加载时，应从持久化存储中获取所有书签。
    *   获取到的书签列表应清晰地展示给用户，包含标题和URL。
    *   **初始数据:** 应用首次（或在无数据时）加载时，列表中应默认包含以下两个书签：
        *   标题: 百度, URL: `https://www.baidu.com`
        *   标题: 起点, URL: `https://www.qidian.com`
        *   (此初始数据逻辑应在Durable Object首次初始化时处理)
*   **数据结构:** 每个书签对象应至少包含一个唯一ID（用于删除操作，可使用`crypto.randomUUID()`生成）、`url`和`title`字段。

### 3.2 用户界面 (UI)
*   **书签列表视图:**
    *   一个简洁的垂直列表，展示所有书签。
    *   每个列表项显示书签标题和URL。
*   **添加书签区域:**
    *   包含输入URL和标题的表单字段。
    *   一个“添加书签”按钮。
*   **删除功能:**
    *   每个书签列表项旁边提供一个清晰可点击的“删除”按钮。

## 4. 技术架构

### 4.1 架构概述
采用现代Web架构，前端由Next.js构建，运行在用户浏览器；后端API由Cloudflare Pages Functions在边缘节点处理；数据持久化通过绑定到Functions的Cloudflare Durable Object实现。所有静态资源和Functions通过Cloudflare Pages CDN分发。

```mermaid
graph LR
    A[用户浏览器] -- HTTPS --> B(Cloudflare Pages CDN);
    B -- Serves --> C{Next.js 应用 (React UI)};
    C -- API请求 /api/* --> D[Cloudflare Pages Functions (Edge)];
    D -- DO Binding (BOOKMARKS_DO) --> E(Cloudflare Durable Object: BookmarkStore);
    E -- Read/Write --> F[DO Storage (Cloudflare Edge)];

    subgraph Cloudflare Platform
        B
        D
        E
        F
    end

    subgraph User Device
        A
        C
    end
```

### 4.2 组件说明
1.  **用户浏览器:** 运行Next.js应用，渲染UI，处理用户交互，发起API请求。
2.  **Cloudflare Pages CDN:** 托管Next.js静态资源和Pages Functions，提供全球低延迟访问。
3.  **Next.js 应用 (React UI):** 使用React构建前端界面。通过`fetch`调用`/api/*`路由与后端通信。
4.  **Cloudflare Pages Functions:** 作为无服务器API后端，处理来自前端的HTTP请求（GET, POST, DELETE）。通过环境中的绑定与Durable Object交互。
5.  **Cloudflare Durable Object (DO) - `BookmarkStore`:**
    *   一个有状态的JavaScript类实例，运行在Cloudflare边缘。
    *   使用**单一实例**（通过固定名称获取ID）存储所有书签数据。
    *   内部维护书签列表，并提供`getBookmarks`, `addBookmark`, `deleteBookmark`等逻辑（可通过其`fetch`方法或直接方法调用实现）。
    *   利用`state.storage` API实现数据的自动持久化。
6.  **DO Storage:** Cloudflare提供的底层强一致性存储，由DO API自动管理。

### 4.3 数据流 (示例: 添加书签)
1.  用户在浏览器填写表单，点击“添加”。
2.  Next.js前端应用发送 `POST /api/bookmarks` 请求，包含URL和标题。
3.  Cloudflare Pages接收请求，路由到对应的Pages Function。
4.  Pages Function从`context.env`获取`BOOKMARKS_DO`绑定。
5.  Function获取单例DO `BookmarkStore`的存根(stub)（使用`idFromName("shared-bookmark-list")`）。
6.  Function调用DO实例的方法（例如，通过`stub.fetch()`转发请求或直接调用`stub.addBookmark(url, title)`）。
7.  DO实例的`addBookmark`方法：
    *   生成新书签的唯一ID。
    *   将新书签添加到内部列表。
    *   调用`this.state.storage.put("bookmarks", updatedList)`将更新后的列表持久化。
    *   返回成功响应（如新书签对象）。
8.  响应沿调用链返回到浏览器。
9.  Next.js前端根据响应更新UI，显示新添加的书签。

### 4.4 可行性与关键点
*   **可行性:** 技术栈匹配良好，适合构建此类轻量级应用原型。
*   **关键点/难点:**
    *   正确理解和使用Durable Objects（单例模式、状态管理、异步交互）。
    *   精确配置Cloudflare Pages Functions与Durable Objects的绑定（本地`wrangler.toml`和部署时Cloudflare Dashboard）。
    *   搭建能够同时运行Next.js开发服务器和`wrangler dev`（模拟Functions+DO）的本地开发环境，并配置好API代理。
    *   错误处理需要覆盖前端、Functions和DO。

## 5. 技术栈

*   **前端框架:** Next.js (使用 React)
*   **语言:** JavaScript
*   **样式:** 原生 CSS / CSS Modules (保持简单)
*   **后端逻辑:** Cloudflare Pages Functions
*   **数据持久化:** Cloudflare Durable Objects
*   **部署平台:** Cloudflare Pages
*   **本地开发/CLI:** Wrangler CLI
*   **包管理器:** npm
*   **版本控制:** Git
*   **运行环境:** Node.js (用于本地开发)

## 6. 非功能需求

*   **部署:** 应用前端和后端Functions必须部署到Cloudflare Pages。
*   **数据持久化:** 必须使用Cloudflare Durable Objects作为唯一的数据存储方案，通过Cloudflare Pages Functions绑定进行交互。
*   **浏览器支持:** 支持所有现代主流浏览器（Chrome, Firefox, Safari, Edge最新版本）。
*   **性能:** 应用应具备良好的响应速度（考虑到Cloudflare边缘网络的优势），但允许原型阶段存在一定的冷启动延迟。
*   **可扩展性限制:** 明确本原型采用单个DO实例，不具备用户隔离能力，不适合大规模多用户场景。
*   **安全性:** 基本的输入验证（如URL格式）应在后端处理，但无需复杂的安全机制（如认证授权）。

## 7. 实现与配置细节要点

### 7.1 Durable Object (`BookmarkStore.js`)
*   实现为一个导出的JavaScript类。
*   构造函数 (`constructor`) 中初始化状态，并从`state.storage`加载现有书签。包含添加初始数据的逻辑（仅当存储为空时）。
*   提供处理HTTP请求的`fetch`方法（或者更推荐：提供明确的业务方法如`addBookmark`, `deleteBookmark`, `getBookmarks`供Function直接调用）。
*   所有修改数据的操作后，必须调用`state.storage.put()`来持久化状态。
*   使用`state.blockConcurrencyWhile()`确保初始化或关键操作的原子性。

### 7.2 Cloudflare Pages Functions (`/functions/api/...` 或 `pages/api/...`)
*   API路由需与前端调用匹配（如 `GET /api/bookmarks`, `POST /api/bookmarks`, `DELETE /api/bookmarks/[id]`）。
*   在函数处理程序（如`onRequestGet`, `onRequestPost`, `onRequestDelete`）中，通过`context.env.BOOKMARKS_DO`访问DO绑定。
*   使用`env.BOOKMARKS_DO.idFromName("shared-bookmark-list")`获取指向单例DO的ID。
*   使用`env.BOOKMARKS_DO.get(id)`获取DO的存根(stub)。
*   通过`stub.fetch(request)`或直接调用stub上的方法 (`await stub.addBookmark(...)`) 与DO交互。
*   处理来自DO的响应或错误，并返回给前端。

### 7.3 本地开发配置 (`wrangler.toml` & `next.config.js`)
*   **`wrangler.toml`:**
    *   配置`name`, `compatibility_date`。
    *   在`[[durable_objects.bindings]]`中定义绑定：
        *   `name = "BOOKMARKS_DO"` (必须与Functions代码中使用的名称一致)
        *   `class_name = "BookmarkStore"` (必须与DO类的导出名称一致)
    *   在`[[migrations]]`中声明DO类：
        *   `tag = "v1"`
        *   `new_classes = ["BookmarkStore"]`
    *   (可选) 配置`[dev]`部分的端口，如`port = 8788`。
*   **`next.config.js`:**
    *   在`development`环境下，配置`rewrites`将`/api/*`的请求代理到`wrangler dev`运行的端口（例如`http://127.0.0.1:8788/api/:path*`）。

### 7.4 部署配置 (Cloudflare Dashboard)
*   **前提:** 在Cloudflare Dashboard -> Workers & Pages -> Durable Objects 中**手动创建一个Durable Object Namespace** (例如 `my-bookmarks-ns`)。
*   **Cloudflare Pages 项目设置:**
    *   连接Git仓库。
    *   设置构建命令 (`npm run build`) 和输出目录 (`.next`)。
    *   在 Settings -> Functions -> Durable Object Bindings 中**添加绑定**:
        *   **Binding Name:** `BOOKMARKS_DO`
        *   **Namespace:** 选择上面创建的Namespace (`my-bookmarks-ns`)。

## 8. 测试策略

*   **核心原则:** 优先进行彻底的本地测试，采用分步方法，便于非编程背景人员理解和排查问题。
*   **所需工具:**
    *   Node.js, npm
    *   Wrangler CLI (已全局安装)
    *   Git
    *   文本编辑器 (如 VS Code)
    *   Web浏览器 (用于前端测试)
    *   (可选) API测试工具如 `curl` 或 Postman (用于直接测试Functions API)
*   **本地测试步骤:**
    1.  **环境启动:** 同时运行 `npm run dev` (启动Next.js) 和 `wrangler pages dev .` (或 `wrangler dev`，启动Functions+DO模拟器)。
    2.  **基础UI:** 访问 `localhost:3000`，验证Next.js应用运行正常，静态UI元素（标题、表单、按钮）可见，初始书签（暂时硬编码在前端）显示。
    3.  **API GET 测试 (独立):** 使用`curl`或Postman访问 `http://localhost:8788/api/bookmarks`。验证是否能从（模拟的）DO获取数据（可能需要先触发一次添加或确保DO构造函数能正确初始化并存储数据）。
    4.  **集成 GET:** 刷新 `localhost:3000` 页面，验证前端是否通过API成功加载并显示书签列表（包括初始数据）。
    5.  **API POST 测试 (独立):** 使用`curl`或Postman向 `http://localhost:8788/api/bookmarks` 发送POST请求（带JSON body）。验证响应是否成功，并再次GET确认数据已添加。
    6.  **集成 POST:** 在 `localhost:3000` 页面，使用表单添加新书签。验证新书签是否出现在列表中。检查 `wrangler dev` 的本地存储 (`.wrangler/state`) 是否更新。
    7.  **API DELETE 测试 (独立):** 获取一个书签的ID，使用`curl`或Postman向 `http://localhost:8788/api/bookmarks/{id}` 发送DELETE请求。验证响应（通常是204 No Content），并再次GET确认数据已删除。
    8.  **集成 DELETE:** 在 `localhost:3000` 页面，点击一个书签的删除按钮。验证该书签是否从列表中移除。
    9.  **重启测试:** 停止并重新启动 `wrangler dev`，然后刷新 `localhost:3000`，验证书签数据是否从本地持久化存储中恢复。
*   **部署后测试:** 在Cloudflare Pages提供的 `*.pages.dev` 域名上重复上述集成测试步骤（添加、删除、刷新页面查看持久性）。

## 9. 交付物

1.  **源代码:**
    *   完整的Next.js项目代码（包括React组件、页面、样式）。
    *   Cloudflare Pages Functions代码（API路由处理逻辑）。
    *   Durable Object `BookmarkStore`类的JavaScript代码。
2.  **配置文件:**
    *   `package.json`
    *   `next.config.js` (包含开发环境代理配置)
    *   `wrangler.toml` (用于本地开发)
    *   `.gitignore` 文件 (内容如下)
3.  **.gitignore 文件内容:**
    ```gitignore
    # Node dependencies
    node_modules/

    # Next.js build outputs and cache
    .next/
    out/

    # Wrangler state and secrets
    .wrangler/

    # Environment variables
    .env*
    !.env.example

    # Log files
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*

    # OS generated files
    .DS_Store
    Thumbs.db

    # IDE settings
    .vscode/
    .idea/

    # Test coverage
    coverage/
    ```

## 10. 假设与约束

*   **开发环境:** 假设开发人员已具备可用的Node.js、npm、Git环境，并已全局安装Wrangler CLI。无法使用`open`命令。
*   **用户模型:** 无用户认证和授权，所有操作针对全局共享的书签列表。
*   **数据量:** 假设书签数量在原型阶段不会达到单个DO实例的处理或存储上限。
*   **网络:** 假设开发和测试期间有稳定的网络连接访问Cloudflare服务（部署时）和本地服务器。

## 11. 未来考虑 (可选)

*   用户账户与认证
*   书签搜索/过滤/标签功能
*   更丰富的UI/UX
*   错误处理与用户反馈优化
*   考虑使用TypeScript