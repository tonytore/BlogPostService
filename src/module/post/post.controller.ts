import {
  ForbiddenError,
  UnauthenticatedError,
} from '@/utils/error/custom_error_handler';
import { PostStatus, Role } from '@prisma/client';
import {
  createPostService,
  CreatePostServiceInput,
  DeletePostService,
  getAllPostService,
  updatePostService,
} from '@/module/post/post.service';
import { MessageMeta, PostCommandPayload } from '@/types/message.types';
import catchAsync from '@/utils/helper/catch_async';
import { successResponse } from '@/utils/helper/response_helper';
import * as svc from '@/module/post/post.service';

interface PostHandlerPayload {
  data: PostCommandPayload;
  meta: MessageMeta;
}

export async function handleCreatePost({ data, meta }: PostHandlerPayload) {
  if (meta.role !== Role.ADMIN && meta.role !== Role.AUTHOR) {
    throw new UnauthenticatedError(
      'Not authorized to create post',
      'post.consumer.handleCreatePost()',
    );
  }
  await createPostService(data as CreatePostServiceInput, meta.userId);
}

export async function handleUpdatePost({ data, meta }: PostHandlerPayload) {
  if (meta.role !== Role.ADMIN && meta.role !== Role.AUTHOR) {
    throw new ForbiddenError(
      'Not authorized to update post',
      'post.consumer.handleUpdatePost',
    );
  }

  if (!data.id) {
    throw new ForbiddenError(
      'Post ID is required for update',
      'post.consumer.handleUpdatePost',
    );
  }

  await updatePostService({
    id: data.id,
    data,
    authorId: meta.userId,
    role: meta.role,
  });
}

export async function handleDeletePost({ data, meta }: PostHandlerPayload) {
  if (meta.role !== Role.ADMIN && meta.role !== Role.AUTHOR) {
    throw new ForbiddenError(
      'Not authorized to delete post',
      'post.consumer.handleDeletePost',
    );
  }

  await DeletePostService(data.id!, meta.userId, meta.role);
}

export const getAllPost = catchAsync(async (req, res) => {
  const posts = await getAllPostService();
  return successResponse(res, 'All Posts fetched successfully', posts);
});

export const getPostByStatus = catchAsync(async (req, res) => {
  const status = req.params.status as PostStatus;
  const posts = await svc.getPostByStatus(status);
  return successResponse(res, 'PostBySlug fetched successfully', posts);
});

export const getAllPostBySlug = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const posts = await svc.getAllPostServiceBySlug(slug);
  return successResponse(res, 'PostBySlug fetched successfully', posts);
});
