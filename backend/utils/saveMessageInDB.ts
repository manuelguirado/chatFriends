import { connectDatabase } from "../connectDatabase";
import { Message } from "../models/messages";
import { Mongoose } from "mongoose";
export function saveMessageInDB(chatID: string, messageContent: string, senderId: string) {
  return connectDatabase()
    .then(() => {
      console.log("✅ Database connected successfully for saveMessageInDB");
      const newMessage = new Message({
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