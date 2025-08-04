"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadby = updateReadby;
function updateReadby(chatID, readyBy, idUser, userId) {
    // Check if the userId is already in the readyBy array
    if (readyBy.includes(userId)) {
        // If it is, remove it
        return readyBy.filter(id => id !== userId);
    }
    else {
        // If it isn't, add it
        return [...readyBy, userId];
    }
}
