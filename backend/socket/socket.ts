import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import { registerUserEvents } from "./userEvents";
import { registerChatEvents } from "./chatEvents";
import Conversation from "../models/Conversation";

dotenv.config();

export function initializeSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // allow all origins
    },
  });

  // Authentication middleware
  io.use((socket: Socket, next: any) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Authentication error: Invalid token"));
        }

        let userData = decoded.user;
        socket.data = userData;
        socket.data.userId = userData.id;
        next();
      }
    );
  });

  // when socket connects, register events
  io.on("connection", async (socket: Socket) => {
    const userId = socket?.data?.userId;
    console.log(
      `User connected: ${socket.id}, UserID: ${userId}, userName: ${socket.data.name}`
    );

    // register events
    registerChatEvents(io, socket);
    registerUserEvents(io, socket);

    // join all the rooms the user is part of
    try {
      const conversations = await Conversation.find({
        participatns: userId,
      }).select("_id");

      conversations.forEach((conversation: any) => {
        socket.join(conversation._id.toString());
      });
    } catch (error: any) {
      console.log("Error in joining conversations", error);
    }

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
}
