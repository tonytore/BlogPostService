import fs from 'fs';
export async function unlinkPhoto(oldUrl: string | null) {
  if (oldUrl) {
    await fs.promises.unlink(oldUrl).catch(() => {});
  }
}
