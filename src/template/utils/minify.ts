export function minifyHtml(html: string): string {
  const placeholders: string[] = [];
  const prePattern = /<pre[\s\S]*?<\/pre>/gi;

  let minified = html.replace(prePattern, match => {
    placeholders.push(match);
    return `__PRE_PLACEHOLDER_${placeholders.length - 1}__`;
  });

  minified = minified
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  placeholders.forEach((content, i) => {
    minified = minified.replace(`__PRE_PLACEHOLDER_${i}__`, content);
  });

  return minified;
}
