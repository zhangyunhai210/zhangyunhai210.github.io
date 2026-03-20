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

### 若访问站点为「空白页」

线上曾出现 **HTTP 200 但 HTML 体积为 0**，浏览器即白屏。常见原因：

1. **Pages 仍使用「从分支部署」且发布仓库根目录 `/(root)`**：根目录若存在 **空的 `index.html`**，或未包含 Hexo **构建产物**（应在 `blog/public`，由 CI 生成），都会白屏。
2. **正确做法**：**Settings → Pages → Source** 选 **「GitHub Actions」**，由工作流上传 **`blog/public`** 的构建结果；合并/推送 **master** 后等待 **Deploy blog to GitHub Pages** 成功。
3. 工作流已增加对 `blog/public/index.html` 非空的校验，避免误传空站点。
