"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
const slugify_1 = __importDefault(require("slugify"));
async function generateSlug(title) {
    const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
    const slug = baseSlug;
    return slug;
}
