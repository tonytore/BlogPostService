import { db } from '../../config/db';
import {
  createCategoryPayload,
  updateCategoryPayload,
} from './category.service';

export async function listCategoryRepository() {
  const categories = await db.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      posts: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const c = await db.category.findUnique({
    where: { slug },
  });

  return c;
}

export async function createCategoryRepository({
  name,
  slug,
}: createCategoryPayload) {
  const category = await db.category.create({
    data: {
      name,
      slug,
    },
  });
  return category;
}

export async function updateCategoryRepository({
  id,
  name,
}: updateCategoryPayload) {
  const category = await db.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return category;
}

export async function deleteCategoryRepository(id: string) {
  const deletedCategory = await db.category.delete({
    where: { id },
  });

  return deletedCategory;
}
