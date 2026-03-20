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

### 若出现 `jekyll-build-pages` / Liquid / Invalid Date 错误

本仓库 **不是 Jekyll 站点**。若在 Actions 中运行了 **`actions/jekyll-build-pages`**（或 Pages 使用了默认 Jekyll 构建），Jekyll 会扫描整个仓库并把 `blog/scaffolds/` 里的 `{{ title }}` 当成 Liquid，导致构建失败。

**请处理：**

1. **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**（不要选「Deploy from a branch」的 Jekyll 流程）。
2. 删除仓库里**仅**用于 Jekyll 的 workflow（例如 `pages-build-deployment`），只保留本仓库的 **Hexo** 工作流（`.github/workflows/gh-pages.yml`）。
3. 根目录已提供 **`_config.yml`**（`exclude: blog`），若仍误跑 Jekyll，可减轻与 Hexo 源码冲突。
