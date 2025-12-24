export function isValidImage(filename: string): boolean {
  return /\.(jpeg|jpg|png|webp)$/i.test(filename);
}
