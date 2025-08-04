"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageTolocalStorage = saveMessageTolocalStorage;
function saveMessageTolocalStorage(message) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}
