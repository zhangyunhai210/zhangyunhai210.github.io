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

仓库根目录已配置 GitHub Actions（`.github/workflows/gh-pages.yml`）：

- 推送到 **`master` / `main`**：执行测试、构建，并**发布**到 Pages。
- 推送到其他分支（如 `cursor/**`）：仅执行测试与构建，**不发布**（避免与 Environment「仅允许从 master 部署」冲突）。

若你希望**从功能分支直接部署**，请到 **Settings → Environments → `github-pages` → Deployment branches**，改为允许对应分支或所有分支。

使用前请在仓库 **Settings → Pages** 中将 **Source** 设为 **GitHub Actions**。

## 说明

- 站点标题、作者、主题等见 `_config.yml`。
- 旧版 `deploy.type: git` 仍保留在配置中；推荐使用上述 Actions 部署，无需在本地执行 `hexo deploy`。
