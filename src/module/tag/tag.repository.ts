import { generateSlug } from "@/utils/generateSlug";
import { db } from "../../config/db";
import { UpdateTagPayload } from "./tag.service";

export async function listTagRepository() {
  const tags = await db.tag.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      posts: true,
    },
  });
  return tags;
}

export async function getTagBySlug(slug: string) {
  const c = await db.tag.findUnique({
    where: { slug },
  });

  return c;
}

export async function createTagRepository(name: string) {
  const tag = await db.tag.create({
    data: {
      name,
      slug: await generateSlug(name),
    },
  });
  return tag;
}

export async function updateTagRepository({ id, name }: UpdateTagPayload) {
  const tag = await db.tag.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return tag;
}

export async function deleteTagRepository(id: string) {
  const deletedTag = await db.tag.delete({
    where: { id },
  });

  return deletedTag;
}
