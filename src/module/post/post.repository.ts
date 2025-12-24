import { PostStatus } from '@prisma/client';
import { createPostPayload, updatePostPayload } from './post.service';
import { generateSlug } from '@/utils/generateSlug';
import { db } from '@/config/db';

export async function listPostStatusRepository(filter: PostStatus) {
  try {
    const posts = await db.post.findMany({
      where: {
        status: filter,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        category: true,
        comments: true,
        tags: true,
      },
    });

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listAllPostRepository() {
  try {
    const posts = await db.post.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        category: true,
        comments: true,
        tags: true,
      },
    });

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  const c = await db.post.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
  });

  return c;
}

export async function getPostRepositoryById(id: string) {
  const c = await db.post.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      author: true,
      category: true,
      comments: true,
      tags: true,
    },
  });

  return c;
}

export async function getPublishedPostBySlug(slug: string) {
  const s = await db.post.findUnique({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
      deletedAt: null,
    },
    include: {
      author: true,
      category: true,
      comments: true,
      tags: true,
    },
  });

  return s;
}

export async function createPostRepository({
  data,
  authorId,
  formattedTags,
  readingTime,
}: createPostPayload) {
  try {
    const slug = await generateSlug(data.title);
    const newPost = await db.post.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        authorId,
        categoryId: data.categoryId,
        tags: formattedTags,
        readingTime,
      },
      include: {
        tags: true,
      },
    });
    return newPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePostRepository({
  id,
  data,
  authorId,
}: updatePostPayload) {
  try {
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        authorId,
        categoryId: data.categoryId,
      },
    });
    return updatedPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function softDeletePostRepository(id: string) {
  const deletedPost = await db.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return deletedPost;
}

export async function hardDeletePostRepository(id: string) {
  const deletedPost = await db.post.delete({
    where: { id },
  });

  return deletedPost;
}

export async function incrementViews(id: string) {
  const updatedPost = await db.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return updatedPost;
}
