"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPostStatusRepository = listPostStatusRepository;
exports.listAllPostRepository = listAllPostRepository;
exports.getPostBySlug = getPostBySlug;
exports.getPostRepositoryById = getPostRepositoryById;
exports.getPublishedPostBySlug = getPublishedPostBySlug;
exports.createPostRepository = createPostRepository;
exports.updatePostRepository = updatePostRepository;
exports.softDeletePostRepository = softDeletePostRepository;
exports.hardDeletePostRepository = hardDeletePostRepository;
exports.incrementViews = incrementViews;
const client_1 = require("@prisma/client");
const generateSlug_1 = require("@/utils/generateSlug");
const db_1 = require("@/config/db");
async function listPostStatusRepository(filter) {
    try {
        const posts = await db_1.db.post.findMany({
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function listAllPostRepository() {
    try {
        const posts = await db_1.db.post.findMany({
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function getPostBySlug(slug) {
    const c = await db_1.db.post.findFirst({
        where: {
            slug,
            deletedAt: null,
        },
    });
    return c;
}
async function getPostRepositoryById(id) {
    const c = await db_1.db.post.findUnique({
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
async function getPublishedPostBySlug(slug) {
    const s = await db_1.db.post.findUnique({
        where: {
            slug,
            status: client_1.PostStatus.PUBLISHED,
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
async function createPostRepository({ data, authorId, formattedTags, readingTime, }) {
    try {
        const slug = await (0, generateSlug_1.generateSlug)(data.title);
        const newPost = await db_1.db.post.create({
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function updatePostRepository({ id, data, authorId, }) {
    try {
        const updatedPost = await db_1.db.post.update({
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function softDeletePostRepository(id) {
    const deletedPost = await db_1.db.post.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
    return deletedPost;
}
async function hardDeletePostRepository(id) {
    const deletedPost = await db_1.db.post.delete({
        where: { id },
    });
    return deletedPost;
}
async function incrementViews(id) {
    const updatedPost = await db_1.db.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
    return updatedPost;
}
