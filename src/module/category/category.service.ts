import { NotFoundError } from '@/utils/error/custom_error_handler';
import * as repo from './category.repository';

export type createCategoryPayload = {
  name: string;
  slug: string;
};

export type updateCategoryPayload = {
  id: string;
  name: string;
};

export async function listCategoryService() {
  return repo.listCategoryRepository();
}

export async function getCategoryBySlugService(slug: string) {
  return repo.getCategoryBySlug(slug);
}

export async function createCategory({ name, slug }: createCategoryPayload) {
  const existingCategory = await repo.getCategoryBySlug(slug);
  if (existingCategory) {
    throw new NotFoundError(
      `Category with slug "${slug}" already exists`,
      'createCategory.categoryService',
    );
  }
  return repo.createCategoryRepository({ name, slug });
}

export async function updateCategory({ id, name }: updateCategoryPayload) {
  return repo.updateCategoryRepository({ id, name });
}

export async function deleteCategoryService(id: string) {
  return repo.deleteCategoryRepository(id);
}
