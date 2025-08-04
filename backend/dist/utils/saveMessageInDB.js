"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageInDB = saveMessageInDB;
const connectDatabase_1 = require("../connectDatabase");
const messages_1 = require("../models/messages");
function saveMessageInDB(chatID, messageContent, senderId) {
    return (0, connectDatabase_1.connectDatabase)()
        .then(() => {
        console.log("✅ Database connected successfully for saveMessageInDB");
        const newMessage = new messages_1.Message({
            chatID,
            content: messageContent,
            senderId,
            TimeStamp: new Date(),
        });
        return newMessage.save();
    })
        .then((savedMessage) => {
        console.log("📥 Message saved in DB:", savedMessage);
        return savedMessage;
    })
        .catch((error) => {
        console.error("Error saving message in DB:", error);
        throw new Error("Error saving message in DB");
    });
}
