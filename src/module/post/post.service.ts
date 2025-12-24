import { calculateReadingTime } from "@/utils/helper/readingTime";
import { PostStatus, Role } from "@prisma/client";
import { createTag } from "../tag/tag.service";
import * as repo from "./post.repository"
import * as viewRepo from "./postView.repository"
import { ForbiddenError, NotFoundError } from "@/utils/error/custom_error_handler";


export interface CreatePostPayload {
    title: string;
    content: string;
    excerpt: string;
    status: PostStatus;
    categoryId: string;
    tags: string[];
    authorId: string;
    role: Role;
}
export interface createPostPayload {
  data: {
    title: string;
    excerpt?: string | null;
    content: string;
    status: PostStatus;
    categoryId?: string | null;
    tags?: string[];
  };
  authorId?: string | null ;
  formattedTags?: { connect: { id: string }[] };
  readingTime?: number;
}
export interface updatePostPayload {
  id: string;
  data: {
    title: string;
    excerpt?: string | null;
    content: string;
    status: PostStatus;
    categoryId?: string | null;
    tags?: string[];
  };
  authorId?: string | null;
  role?: Role;
}

export interface viewPostPayload {
  userId?: string;
  ip?: string;
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
      "Post not found",
      "post.service.getAllPostServiceBySlug",
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
      "Post not found",
      "post.service.getPublishedPostServiceBySlug",
    );
  }
  const hasViewed = await viewRepo.hasViewedPost(post.id, { userId, ip });
  if (!hasViewed) {
    await viewRepo.createPostView(post.id, { userId, ip });
    await repo.incrementViews(post.id);
  }
  return post;
}

export async function createPostService({
    data,
    authorId
}: createPostPayload){

    const tags = data.tags ? await Promise.all(data.tags.map((name)  =>  createTag(name))) : []
    const readingTime = calculateReadingTime(data.content)

    return repo.createPostRepository({
        data,
        readingTime,
        authorId,
        formattedTags: {
            connect: tags.map((tag) => ({ id: tag.id })),
        }
    })
}

export async function updatePostService({
  id,
  data,
  authorId,
  role,
}: updatePostPayload) {
  const post = await repo.getPostRepositoryById(id);
  if (!post || post.deletedAt) {
    throw new NotFoundError("Post not found", "post.service.updatePostService");
  }

  if (post.authorId !== authorId && role !== Role.ADMIN) {
    throw new ForbiddenError(
      "You are not authorized to update this post",
      "post.service.updatePostService",
    );
  }

  return repo.updatePostRepository({
    id,
    data,
    authorId,
  });
}
