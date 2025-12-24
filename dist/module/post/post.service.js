"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostStatusService = getPostStatusService;
exports.getAllPostService = getAllPostService;
exports.getPostServiceById = getPostServiceById;
exports.getAllPostServiceBySlug = getAllPostServiceBySlug;
exports.getPublishedPostServiceBySlug = getPublishedPostServiceBySlug;
exports.createPostService = createPostService;
exports.updatePostService = updatePostService;
const readingTime_1 = require("@/utils/helper/readingTime");
const client_1 = require("@prisma/client");
const tag_service_1 = require("../tag/tag.service");
const repo = __importStar(require("./post.repository"));
const viewRepo = __importStar(require("./postView.repository"));
const custom_error_handler_1 = require("@/utils/error/custom_error_handler");
async function getPostStatusService(status) {
    return repo.listPostStatusRepository(status);
}
async function getAllPostService() {
    return repo.listAllPostRepository();
}
async function getPostServiceById(id) {
    return repo.getPostRepositoryById(id);
}
async function getAllPostServiceBySlug(slug) {
    const post = await repo.getPostBySlug(slug);
    if (!post) {
        throw new custom_error_handler_1.NotFoundError('Post not found', 'post.service.getAllPostServiceBySlug');
    }
    return post;
}
async function getPublishedPostServiceBySlug(slug, { userId, ip }) {
    const post = await repo.getPublishedPostBySlug(slug);
    if (!post) {
        throw new custom_error_handler_1.NotFoundError('Post not found', 'post.service.getPublishedPostServiceBySlug');
    }
    const hasViewed = await viewRepo.hasViewedPost(post.id, { userId, ip });
    if (!hasViewed) {
        await viewRepo.createPostView(post.id, { userId, ip });
        await repo.incrementViews(post.id);
    }
    return post;
}
async function createPostService({ data, authorId }) {
    const tags = data.tags
        ? await Promise.all(data.tags.map((name) => (0, tag_service_1.createTag)(name)))
        : [];
    const readingTime = (0, readingTime_1.calculateReadingTime)(data.content);
    return repo.createPostRepository({
        data,
        readingTime,
        authorId,
        formattedTags: {
            connect: tags.map((tag) => ({ id: tag.id })),
        },
    });
}
async function updatePostService({ id, data, authorId, role, }) {
    const post = await repo.getPostRepositoryById(id);
    if (!post || post.deletedAt) {
        throw new custom_error_handler_1.NotFoundError('Post not found', 'post.service.updatePostService');
    }
    if (post.authorId !== authorId && role !== client_1.Role.ADMIN) {
        throw new custom_error_handler_1.ForbiddenError('You are not authorized to update this post', 'post.service.updatePostService');
    }
    return repo.updatePostRepository({
        id,
        data,
        authorId,
    });
}
