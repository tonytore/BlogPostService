import { PostStatus, Role } from '@prisma/client';

interface MessageMeta {
  userId: string;
  role: Role;
  requestId: string;
  timestamp: number;
}

export interface MessagePayload<T> {
  action: 'post.create' | 'post.update' | 'post.delete';
  data: T;
  meta: MessageMeta;
}

export interface postMessage {
  data: {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    status: PostStatus;
    categoryId: string;
    tags: string[];
  };
  meta: {
    userId: string;
    role: Role;
  };
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
  authorId?: string | null;
  formattedTags?: { connect: { id: string }[] };
  readingTime?: number;
}
export interface updatePostPayload {
  id: string;
  data: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    status?: PostStatus;
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
