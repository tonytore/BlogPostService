export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split('/s+/').length;
  const minutes = words / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}
