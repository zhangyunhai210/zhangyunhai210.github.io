import { describe, it, expect } from 'vitest';
import {
  slugifyFilename,
  formatPostDate,
  yamlEscapeScalar,
  buildFrontmatter,
  computeGithubPagesBase,
  patchConfigUrlRoot,
} from '../lib/post-utils.mjs';

describe('slugifyFilename', () => {
  it('保留中文并去除斜杠', () => {
    expect(slugifyFilename('a/b')).toBe('a-b');
    expect(slugifyFilename('  标题  ')).toBe('标题');
  });

  it('空标题返回占位名', () => {
    expect(slugifyFilename('')).toBe('untitled');
    expect(slugifyFilename('   ')).toBe('untitled');
    expect(slugifyFilename(null)).toBe('untitled');
  });
});

describe('formatPostDate', () => {
  it('格式化为 Hexo 所需字符串', () => {
    const d = new Date(Date.UTC(2024, 0, 2, 3, 4, 5));
    // 本地时区可能不同，只校验长度与分隔符
    expect(formatPostDate(d)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });
});

describe('yamlEscapeScalar', () => {
  it('普通字符串不加引号', () => {
    expect(yamlEscapeScalar('hello')).toBe('hello');
    expect(yamlEscapeScalar('中文')).toBe('中文');
  });

  it('含冒号等字符时加引号', () => {
    expect(yamlEscapeScalar('a:b')).toMatch(/^\".*\"$/);
  });
});

describe('buildFrontmatter', () => {
  it('生成 front matter', () => {
    const fm = buildFrontmatter({
      title: '测试',
      date: new Date(2024, 5, 1, 12, 0, 0),
      tags: ['web'],
    });
    expect(fm).toContain('title:');
    expect(fm).toContain('测试');
    expect(fm).toContain('tags:');
    expect(fm).toContain('web');
    expect(fm.startsWith('---')).toBe(true);
  });

  it('支持 categories', () => {
    const fm = buildFrontmatter({
      title: 'x',
      categories: ['笔记'],
    });
    expect(fm).toContain('categories:');
    expect(fm).toContain('笔记');
  });
});

describe('computeGithubPagesBase', () => {
  it('用户站点 username.github.io 使用根路径', () => {
    const r = computeGithubPagesBase('zhang', 'zhang.github.io');
    expect(r.url).toBe('https://zhang.github.io/');
    expect(r.root).toBe('/');
  });

  it('项目仓库使用子路径', () => {
    const r = computeGithubPagesBase('zhang', 'blog');
    expect(r.url).toBe('https://zhang.github.io/blog/');
    expect(r.root).toBe('/blog/');
  });
});

describe('patchConfigUrlRoot', () => {
  it('替换 url 与 root', () => {
    const raw = 'url: http://old\nroot: /\n';
    const out = patchConfigUrlRoot(raw, 'https://x.github.io/y/', '/y/');
    expect(out).toContain('url: https://x.github.io/y/');
    expect(out).toContain('root: /y/');
  });
});
