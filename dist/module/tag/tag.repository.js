"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTagRepository = listTagRepository;
exports.getTagBySlug = getTagBySlug;
exports.createTagRepository = createTagRepository;
exports.updateTagRepository = updateTagRepository;
exports.deleteTagRepository = deleteTagRepository;
const generateSlug_1 = require("@/utils/generateSlug");
const db_1 = require("../../config/db");
async function listTagRepository() {
    const tags = await db_1.db.tag.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            posts: true,
        },
    });
    return tags;
}
async function getTagBySlug(slug) {
    const c = await db_1.db.tag.findUnique({
        where: { slug },
    });
    return c;
}
async function createTagRepository(name) {
    const tag = await db_1.db.tag.create({
        data: {
            name,
            slug: await (0, generateSlug_1.generateSlug)(name),
        },
    });
    return tag;
}
async function updateTagRepository({ id, name }) {
    const tag = await db_1.db.tag.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
    return tag;
}
async function deleteTagRepository(id) {
    const deletedTag = await db_1.db.tag.delete({
        where: { id },
    });
    return deletedTag;
}
