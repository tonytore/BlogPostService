import { Role, PostStatus } from '@prisma/client';

export interface MessageMeta {
  userId: string;
  role: Role;
  requestId: string;
  timestamp: number;
}

export interface PostCommandPayload {
  id?: string;
  title?: string;
  content?: string;
  excerpt?: string | null;
  status?: PostStatus;
  categoryId?: string | null;
  tags?: string[];
}

export interface PostCommandMessage {
  action: 'post.create' | 'post.update' | 'post.delete';
  payload: {
    data: PostCommandPayload;
    meta: MessageMeta;
  };
}
