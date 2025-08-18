"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageInDB = saveMessageInDB;
var connectDatabase_1 = require("../connectDatabase");
var messages_1 = require("../models/messages");
function saveMessageInDB(chatID, messageContent, senderId) {
    return (0, connectDatabase_1.connectDatabase)()
        .then(function () {
        console.log("✅ Database connected successfully for saveMessageInDB");
        var newMessage = new messages_1.Message({
            chatID: chatID,
            content: messageContent,
            senderId: senderId,
            TimeStamp: new Date(),
        });
        return newMessage.save();
    })
        .then(function (savedMessage) {
        console.log("📥 Message saved in DB:", savedMessage);
        return savedMessage;
    })
        .catch(function (error) {
        console.error("Error saving message in DB:", error);
        throw new Error("Error saving message in DB");
    });
}
