/**
 * 博客文章文件名与 Front Matter 工具函数（供本地编写与保存 Markdown 使用）
 */

/**
 * 将标题转为安全的 Markdown 文件名（保留中文，去除路径分隔符）
 * @param {string} title
 * @returns {string}
 */
export function slugifyFilename(title) {
  if (!title || typeof title !== 'string') {
    return 'untitled';
  }
  return title.replace(/[/\\]/g, '-').trim() || 'untitled';
}

/**
 * Hexo 文章日期格式：YYYY-MM-DD HH:mm:ss
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function formatPostDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/**
 * YAML 简单转义：含特殊字符时用双引号包裹
 * @param {string} s
 * @returns {string}
 */
export function yamlEscapeScalar(s) {
  const str = String(s);
  if (/[:#\[\]{}&*!|>'"%@`]|^\s|\s$/.test(str) || str.includes('\n')) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * 生成 Hexo 文章 Front Matter 文本
 * @param {{ title: string, date?: Date, tags?: string[], categories?: string[] }} opts
 * @returns {string}
 */
export function buildFrontmatter({ title, date = new Date(), tags = [], categories = [] }) {
  const lines = ['---'];
  lines.push(`title: ${yamlEscapeScalar(title)}`);
  lines.push(`date: ${formatPostDate(date)}`);
  if (tags.length > 0) {
    lines.push('tags:');
    for (const t of tags) {
      lines.push(`- ${yamlEscapeScalar(t)}`);
    }
  }
  if (categories.length > 0) {
    lines.push('categories:');
    for (const c of categories) {
      lines.push(`- ${yamlEscapeScalar(c)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n`;
}

/**
 * 根据 GitHub 仓库计算 Pages 的 url 与 root（用于 CI 注入）
 * @param {string} owner
 * @param {string} repoName
 * @returns {{ url: string, root: string }}
 */
export function computeGithubPagesBase(owner, repoName) {
  const isUserSite = repoName === `${owner}.github.io`;
  if (isUserSite) {
    return {
      url: `https://${repoName}/`,
      root: '/',
    };
  }
  return {
    url: `https://${owner}.github.io/${repoName}/`,
    root: `/${repoName}/`,
  };
}

/**
 * 替换 _config.yml 中的 url 与 root 行（供 GitHub Actions 使用）
 * @param {string} yamlContent
 * @param {string} url
 * @param {string} root
 * @returns {string}
 */
export function patchConfigUrlRoot(yamlContent, url, root) {
  let out = yamlContent.replace(/^url:\s*.+$/m, `url: ${url}`);
  out = out.replace(/^root:\s*.+$/m, `root: ${root}`);
  return out;
}
