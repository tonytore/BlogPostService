import { db } from '@/config/db';
import { viewPostPayload } from './post.service';

export async function createPostView(
  postId: string,
  { userId, ip }: viewPostPayload,
) {
  const postView = await db.postView.create({
    data: {
      postId,
      userId,
      ip,
    },
  });
  return postView;
}

export async function hasViewedPost(
  postId: string,
  { userId, ip }: viewPostPayload,
) {
  return await db.postView.findFirst({
    where: {
      postId,
      OR: [...(userId ? [{ userId }] : []), ...(ip ? [{ ip }] : [])].filter(
        Boolean,
      ),
    },
  });
}
