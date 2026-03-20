# 钓鱼小屋 · Hexo 源码

博客文章源码与主题配置位于本目录，构建输出在 `public/`（已加入 `.gitignore`）。

## 本地开发

```bash
cd blog
npm ci
npx hexo server
```

浏览器访问提示的本地地址即可预览。

## 编写与保存文章

1. **使用 Hexo 脚手架**（与 `scaffolds/post.md` 一致）：

   ```bash
   npx hexo new "文章标题"
   ```

2. **使用本仓库脚本**（直接写入 `source/_posts/*.md`，可带标签与分类）：

   ```bash
   node scripts/save-post.mjs "文章标题" --tags web,前端
   echo "正文内容" | node scripts/save-post.mjs "另一篇"
   ```

   若文件已存在，脚本会拒绝覆盖，避免误删。

## 构建

```bash
npm run build
```

## 测试与覆盖率

```bash
npm test
npm run test:coverage
```

## GitHub Pages 部署

仓库根目录已配置 GitHub Actions（`.github/workflows/gh-pages.yml`）：推送至 `master` / `main` / `cursor/**` 分支时会自动在 CI 中执行 `patch-pages-config.mjs`，根据 `GITHUB_REPOSITORY` 设置 `url` 与 `root`（区分用户站点 `username.github.io` 与普通仓库子路径），再执行 `hexo generate` 并发布。

使用前请在仓库 **Settings → Pages** 中将 **Source** 设为 **GitHub Actions**。

## 说明

- 站点标题、作者、主题等见 `_config.yml`。
- 旧版 `deploy.type: git` 仍保留在配置中；推荐使用上述 Actions 部署，无需在本地执行 `hexo deploy`。
