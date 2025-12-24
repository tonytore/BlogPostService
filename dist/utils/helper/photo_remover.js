"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkPhoto = unlinkPhoto;
const fs_1 = __importDefault(require("fs"));
async function unlinkPhoto(oldUrl) {
    if (oldUrl) {
        await fs_1.default.promises.unlink(oldUrl).catch(() => { });
    }
}
