export function getFileName(filePath: string): string {
  const lastPart = filePath.split('/').pop();
  return lastPart && lastPart !== '' ? lastPart : filePath;
}
