"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageTolocalStorage = saveMessageTolocalStorage;
exports.recoverChatMessages = recoverChatMessages;
exports.updateReadby = updateReadby;
const messages_1 = require("../models/messages");
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
//function to recover the messages chat from the database
async function recoverChatMessages(chatID) {
    try {
        const messages = await messages_1.Message.find({ chatID }).sort({ TimeStamp: 1 });
        return messages;
    }
    catch (error) {
        console.error("Error al recuperar los mensajes del chat:", error);
        throw new Error("Error al recuperar los mensajes del chat");
    }
}
function saveMessageTolocalStorage(message) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}
