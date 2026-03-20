#!/usr/bin/env node
/**
 * 在 source/_posts 下创建并保存一篇 Markdown 文章（可与 hexo new 配合使用）
 * 用法: node tools/save-post.mjs "文章标题" [--tags a,b,c] [--cat 分类]
 * 正文从 stdin 传入，或使用 --content "..."；若都为空则写入占位段落。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildFrontmatter,
  slugifyFilename,
} from '../lib/post-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, '..', 'source', '_posts');

function parseArgs(argv) {
  const args = { title: '', tags: [], categories: [], content: null };
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tags' && argv[i + 1]) {
      args.tags = argv[++i].split(/[,，]/).map((s) => s.trim()).filter(Boolean);
    } else if ((a === '--cat' || a === '--category') && argv[i + 1]) {
      args.categories = [argv[++i].trim()];
    } else if (a === '--content' && argv[i + 1]) {
      args.content = argv[++i];
    } else if (!a.startsWith('-')) {
      rest.push(a);
    }
  }
  args.title = rest.join(' ').trim();
  return args;
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

async function main() {
  const { title, tags, categories, content: contentArg } = parseArgs(process.argv);
  if (!title) {
    console.error('用法: node tools/save-post.mjs "文章标题" [--tags a,b] [--cat 分类] [--content "正文"]');
    process.exit(1);
  }

  const stdinText = contentArg != null ? contentArg : await readStdin();
  const body =
    stdinText.trim().length > 0
      ? stdinText.trimEnd()
      : '在此编写正文，可使用 Markdown。\n\n<!-- more -->\n';

  const fm = buildFrontmatter({ title, tags, categories });
  const filename = `${slugifyFilename(title)}.md`;
  const fullPath = path.join(postsDir, filename);

  if (fs.existsSync(fullPath)) {
    console.error(`文件已存在，未覆盖: ${fullPath}`);
    process.exit(2);
  }

  fs.mkdirSync(postsDir, { recursive: true });
  fs.writeFileSync(fullPath, `${fm}\n${body}\n`, 'utf8');
  console.log(`已保存: ${fullPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
