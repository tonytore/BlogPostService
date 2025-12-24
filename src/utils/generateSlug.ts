import slugify from "slugify";

export async function generateSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;

  return slug;
}
