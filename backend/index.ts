import next from "next";
import { Message } from "./models/messages";
import {
  updateReadby,
  recoverChatMessages,
  saveMessageTolocalStorage,
} from "./utils/utils";
import dotenv from "dotenv";
import { connectDatabase } from "../frontend/connectDatabase";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
connectDatabase()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });
app
  .prepare()
  .then(() => {
    const httpServer = createServer(handle);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", async (Socket) => {
      console.log("A user connected");

      Socket.on("joinChat", async (chatID: string) => {
        const messages = await recoverChatMessages(chatID);
        Socket.join(chatID);
        console.log(`User joined chat: ${chatID}`);

        Socket.emit("chatMessages", messages);
      });

      Socket.on(
        "SendMessage",
        async (data: { chatID: string; content: string; idUser?: string }) => {
          try {
            const message = new Message({
              chatID: new mongoose.Types.ObjectId(data.chatID),
              content: data.content,
              idUser: data.idUser
                ? new mongoose.Types.ObjectId(data.idUser)
                : undefined,
              TimeStamp: new Date(),
            });
            await message.save();
            console.log("Message saved:", message);
            // Emit the new message to all clients in the chat room
            io.to(data.chatID).emit("newMessage", message);
            // Update the readBy field for the message
            updateReadby(data.chatID, message.readyBy, data.idUser, Socket.id);
            console.log("Message readBy updated:", message._id);
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      );
      Socket.on("offline", async (chatID: string) => {
        try {
          const message = `User is offline in chat: ${chatID}`;
          saveMessageTolocalStorage(message);
          console.log("Message saved to local storage:", message);

          io.to(chatID).emit("userOffline", { chatID, message });

          const messages = await recoverChatMessages(chatID);
          Socket.emit("chatMessages", messages);
        } catch (error) {
          console.error("Error handling offline event:", error);
        }
      });

      Socket.on("disconnect", () => {
        console.log("A user disconnected");
        Socket.leave(Socket.id);
      });
    });

    httpServer
      .once("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  })
  .catch((error) => {
    console.error("Error during app preparation:", error);
    process.exit(1);
  });
