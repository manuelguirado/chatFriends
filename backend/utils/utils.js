"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadby = updateReadby;
function updateReadby(chatID, readyBy, idUser, userId) {
    // Check if the userId is already in the readyBy array
    if (readyBy.includes(userId)) {
        // If it is, remove it
        return readyBy.filter(function (id) { return id !== userId; });
    }
    else {
        // If it isn't, add it
        return __spreadArray(__spreadArray([], readyBy, true), [userId], false);
    }
}
