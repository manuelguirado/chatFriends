
import { Message } from "./models/messages";
import { updateReadby,recoverChatMessages} from "./utils/utils";
import {Server} from "socket.io";
import dotenv from "dotenv";
import express from "express";
// Update the import path below if your connectToDatabase file is actually in the backend folder
import { connectDatabase } from "../frontend/connectDatabase";
import mongoose from "mongoose";
import { createServer } from "http";
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
try{
     connectDatabase();
}catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
}
io.on ("connection", (socket) => { 
    console.log("a user connected:", socket.id);
    socket.on("joinChat", async (chatID) => {
        try{ 
            console.log("Usuario se unió al chat:", chatID);
            // Verificar si el chatID es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(chatID)) {
                socket.emit("error", "Chat ID inválido");
                return;
            }
            // Unirse a la sala del chat
            socket.join(chatID);
            // Emitir un mensaje de confirmación
            socket.emit("joinedChat", `Te has unido al chat: ${chatID}`);
            // Recuperar los mensajes del chat desde la base de datos
            const messages = await recoverChatMessages(chatID);
            if (messages.length > 0) {
                // Enviar los mensajes al usuario que se unió
                socket.emit("chatMessages", messages);

            }else{
                // Si no hay mensajes, enviar un mensaje de bienvenida
                socket.emit("chatMessages", [{ content: "Bienvenido al chat", TimeStamp: new Date(), id: socket.id }]);
            }
            // Emitir un evento para que los demás usuarios sepan que alguien se unió
            socket.to(chatID).emit("userJoined", `Un usuario se unió al chat: ${chatID}`);
            socket.on("sendMessage", async (messageData) => {
                try { 
                    console.log("Mensaje recibido:", messageData);
                    // Validar el mensaje
                    if (!messageData.content || !messageData.chatID) {
                        socket.emit("error", "Mensaje o chatID inválido");
                        return;
                    }
                    // Crear un nuevo mensaje
                    const newMessage = new Message({
                        chatID: messageData.chatID,
                        idUser: messageData.idUser || socket.id, // Usar socket.id si no se proporciona idUser
                        content: messageData.content,
                        TimeStamp: new Date(),
                        readyBy: updateReadby([], socket.id) // Inicializar readyBy con el socket.id del usuario que envía el mensaje
                    });
                    // Guardar el mensaje en la base de datos
                    await newMessage.save();
                    // Emitir el mensaje a todos los usuarios en la sala del chat
                    io.to(messageData.chatID).emit("newMessage", newMessage);
                    console.log("Mensaje enviado:", newMessage);


                }catch (error: any) {
                    console.error("Error al enviar el mensaje:", error);
                    socket.emit("error", "Error al enviar el mensaje");
                }

            });
            socket.on("disconnect", () => {
                console.log("Usuario desconectado:", socket.id);
                socket.leave(chatID);
                // Emitir un evento para que los demás usuarios sepan que alguien se desconectó
                socket.to(chatID).emit("userLeft", `Un usuario se desconectó del chat: ${chatID}`);
            });
        }catch(error: any) {
            console.error("Error al unirse al chat:", error);
            socket.emit("error", "Error al unirse al chat");
        }
    });

})