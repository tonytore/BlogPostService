import {
  ForbiddenError,
  UnauthenticatedError,
} from '@/utils/error/custom_error_handler';
import { Role } from '@prisma/client';
import {
  createPostService,
  CreatePostServiceInput,
  DeletePostService,
  updatePostService,
} from './post.service';
import { MessageMeta, PostCommandPayload } from '@/types/message.types';

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
