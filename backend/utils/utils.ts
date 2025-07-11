import { Message } from "../models/messages";

function updateReadby(chatID: string, readyBy: string[], idUser: string | undefined, userId: string): string[] {
    // Check if the userId is already in the readyBy array
    if (readyBy.includes(userId)) {
        // If it is, remove it
        return readyBy.filter(id => id !== userId);
    } else {
        // If it isn't, add it
        return [...readyBy, userId];
    }
}
//function to recover the messages chat from the database
async function recoverChatMessages(chatID: string) {
    try {
        const messages = await Message.find({ chatID }).sort({ TimeStamp: 1 });
        return messages;
    } catch (error) {
        console.error("Error al recuperar los mensajes del chat:", error);
        throw new Error("Error al recuperar los mensajes del chat");
    }
}
function saveMessageTolocalStorage(message: string): void {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

export { saveMessageTolocalStorage, recoverChatMessages, updateReadby };
