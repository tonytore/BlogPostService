import slugify from 'slugify';

export async function generateSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  const slug = baseSlug;

  return slug;
}
