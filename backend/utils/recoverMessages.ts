import  { connectDatabase } from "../connectDatabase";
import { Message } from "../models/messages";
//function to recover the messages chat from the database

async function recoverChatMessages(chatID: string, currentUserEmail: string) {
    try { 

        await connectDatabase().then(() => {
            console.log("✅ Database connected successfully for recoverChatMessages");
        }); // Ensure the database connection is established
        const messages = await Message.find({ chatID }).sort({ TimeStamp: 1 });
        return messages;
    } catch (error) {
        console.error("Error al recuperar los mensajes del chat:", error);
        throw new Error("Error al recuperar los mensajes del chat");
    }
}

export {recoverChatMessages};