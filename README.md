# 博客仓库说明

- **`blog/`**：Hexo 博客源码（文章 Markdown、主题、构建脚本）。**以该目录为唯一维护入口**，在此执行 `npm run build` 生成静态站点。
- **仓库根目录下的 HTML/CSS 等**：历史静态导出快照，可与 `blog/public` 构建结果对照；新内容请只在 `blog/source/_posts` 中编辑。

详细用法见 [blog/README.md](./blog/README.md)。

## 快速开始

```bash
cd blog && npm ci && npx hexo server
```

## CI / GitHub Pages

推送默认分支后，GitHub Actions 会构建 `blog/` 并部署到 Pages。详见 `blog/README.md`。
