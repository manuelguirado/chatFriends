import { Message } from "../models/messages";
import { connectDatabase } from "../connectDatabase";

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


export { updateReadby };
