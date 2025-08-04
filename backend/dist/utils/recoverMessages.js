"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverChatMessages = recoverChatMessages;
const connectDatabase_1 = require("../connectDatabase");
const messages_1 = require("../models/messages");
//function to recover the messages chat from the database
async function recoverChatMessages(chatID, currentUserEmail) {
    try {
        await (0, connectDatabase_1.connectDatabase)().then(() => {
            console.log("✅ Database connected successfully for recoverChatMessages");
        }); // Ensure the database connection is established
        const messages = await messages_1.Message.find({ chatID }).sort({ TimeStamp: 1 });
        return messages;
    }
    catch (error) {
        console.error("Error al recuperar los mensajes del chat:", error);
        throw new Error("Error al recuperar los mensajes del chat");
    }
}
