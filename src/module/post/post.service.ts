import { calculateReadingTime } from '@/utils/helper/readingTime';
import { PostStatus, Role } from '@prisma/client';
import { createTag } from '../tag/tag.service';
import * as repo from './post.repository';
import * as viewRepo from './postView.repository';
import {
  ForbiddenError,
  NotFoundError,
} from '@/utils/error/custom_error_handler';
import { viewPostPayload } from '@/types/type';

export interface CreatePostServiceInput {
  title: string;
  content: string;
  excerpt?: string | null;
  status: PostStatus;
  categoryId?: string | null;
  tags?: string[];
}

export interface UpdatePostServiceInput {
  id: string;
  data: Partial<CreatePostServiceInput>;
  authorId: string;
  role: Role;
}

export async function getPostStatusService(status: PostStatus) {
  return repo.listPostStatusRepository(status);
}

export async function getAllPostService() {
  return repo.listAllPostRepository();
}

export async function getPostServiceById(id: string) {
  return repo.getPostRepositoryById(id);
}

export async function getAllPostServiceBySlug(slug: string) {
  const post = await repo.getPostBySlug(slug);
  if (!post) {
    throw new NotFoundError(
      'Post not found',
      'post.service.getAllPostServiceBySlug',
    );
  }
  return post;
}

export async function getPublishedPostServiceBySlug(
  slug: string,
  { userId, ip }: viewPostPayload,
) {
  const post = await repo.getPublishedPostBySlug(slug);
  if (!post) {
    throw new NotFoundError(
      'Post not found',
      'post.service.getPublishedPostServiceBySlug',
    );
  }
  const hasViewed = await viewRepo.hasViewedPost(post.id, { userId, ip });
  if (!hasViewed) {
    await viewRepo.createPostView(post.id, { userId, ip });
    await repo.incrementViews(post.id);
  }
  return post;
}

export async function createPostService(
  data: CreatePostServiceInput,
  authorId: string,
) {
  const tags = data.tags
    ? await Promise.all(data.tags.map((name) => createTag(name)))
    : [];
  const readingTime = calculateReadingTime(data.content);

  return repo.createPostRepository({
    data,
    authorId,
    formattedTags: tags.length
      ? {
          connect: tags.map((tag) => ({ id: tag.id })),
        }
      : undefined,
    readingTime,
  });
}

export async function updatePostService({
  id,
  data,
  authorId,
  role,
}: UpdatePostServiceInput) {
  const post = await repo.getPostRepositoryById(id);
  if (!post || post.deletedAt) {
    throw new NotFoundError('Post not found', 'post.service.updatePostService');
  }

  if (post.authorId !== authorId && role !== Role.ADMIN) {
    throw new ForbiddenError(
      'You are not authorized to update this post',
      'post.service.updatePostService',
    );
  }

  return repo.updatePostRepository({
    id,
    data,
    authorId,
  });
}

export async function DeletePostService(
  id: string,
  userId: string,
  role: Role,
) {
  const post = await repo.getPostRepositoryById(id);
  if (!post || post.deletedAt) {
    throw new NotFoundError('Post not found', 'post.service.deletePostService');
  }

  if (post.authorId !== userId && role !== Role.ADMIN) {
    throw new ForbiddenError(
      'You are not allowed to delete this post',
      'post.service.hardDeletePostService',
    );
  }
  return repo.DeletePostRepository(id);
}
