#!/bin/bash

# 启动Next.js开发服务器
echo "启动Next.js开发服务器..."
npm run dev &

# 启动Wrangler开发环境以模拟Cloudflare Pages Functions和Durable Objects
echo "启动Wrangler开发环境..."
npx wrangler dev