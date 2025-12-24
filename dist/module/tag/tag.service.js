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
exports.listTagService = listTagService;
exports.getTagBySlugService = getTagBySlugService;
exports.createTag = createTag;
exports.updateTag = updateTag;
exports.deleteTagService = deleteTagService;
const repo = __importStar(require("./tag.repository"));
const generateSlug_1 = require("@/utils/generateSlug");
async function listTagService() {
    return repo.listTagRepository();
}
async function getTagBySlugService(slug) {
    return repo.getTagBySlug(slug);
}
async function createTag(name) {
    const slug = await (0, generateSlug_1.generateSlug)(name);
    const existingTag = await repo.getTagBySlug(slug);
    if (existingTag) {
        return existingTag;
    }
    return repo.createTagRepository(name);
}
async function updateTag({ id, name }) {
    return repo.updateTagRepository({ id, name });
}
async function deleteTagService(id) {
    return repo.deleteTagRepository(id);
}
