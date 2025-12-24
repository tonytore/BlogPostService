"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidImage = isValidImage;
function isValidImage(filename) {
    return /\.(jpeg|jpg|png|webp)$/i.test(filename);
}
