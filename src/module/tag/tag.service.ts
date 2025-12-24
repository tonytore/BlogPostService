import * as repo from "./tag.repository";
import { generateSlug } from "@/utils/generateSlug";

export interface UpdateTagPayload {
  id: string;
  name: string;
}

export async function listTagService() {
  return repo.listTagRepository();
}

export async function getTagBySlugService(slug: string) {
  return repo.getTagBySlug(slug);
}

export async function createTag(name: string) {
  const slug = await generateSlug(name);
  const existingTag = await repo.getTagBySlug(slug);
  if (existingTag) {
    return existingTag;
  }
  return repo.createTagRepository(name);
}

export async function updateTag({ id, name }: UpdateTagPayload) {
  return repo.updateTagRepository({ id, name });
}

export async function deleteTagService(id: string) {
  return repo.deleteTagRepository(id);
}
