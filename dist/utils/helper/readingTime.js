"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReadingTime = calculateReadingTime;
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split('/s+/').length;
    const minutes = words / wordsPerMinute;
    return Math.max(1, Math.ceil(minutes));
}
