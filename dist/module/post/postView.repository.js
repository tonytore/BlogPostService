"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostView = createPostView;
exports.hasViewedPost = hasViewedPost;
const db_1 = require("@/config/db");
async function createPostView(postId, { userId, ip }) {
    const postView = await db_1.db.postView.create({
        data: {
            postId,
            userId,
            ip,
        },
    });
    return postView;
}
async function hasViewedPost(postId, { userId, ip }) {
    return await db_1.db.postView.findFirst({
        where: {
            postId,
            OR: [...(userId ? [{ userId }] : []), ...(ip ? [{ ip }] : [])].filter(Boolean),
        },
    });
}
