#!/usr/bin/env node
/**
 * 在 GitHub Actions 中根据 GITHUB_REPOSITORY 设置 Hexo 的 url / root，便于 Pages 子路径部署
 * 本地未设置 GITHUB_REPOSITORY 时直接退出（不修改 _config.yml）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeGithubPagesBase, patchConfigUrlRoot } from '../lib/post-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '..', '_config.yml');

function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) {
    console.log('未设置 GITHUB_REPOSITORY，跳过 url/root 补丁（本地构建）');
    return;
  }
  const [owner, name] = repo.split('/');
  if (!owner || !name) {
    console.warn('GITHUB_REPOSITORY 格式无效:', repo);
    return;
  }
  const { url, root } = computeGithubPagesBase(owner, name);
  let content = fs.readFileSync(configPath, 'utf8');
  content = patchConfigUrlRoot(content, url, root);
  fs.writeFileSync(configPath, content, 'utf8');
  console.log(`已写入 GitHub Pages 配置: url=${url} root=${root}`);
}

main();
