import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import { registerUserEvents } from "./userEvents";

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
    registerUserEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
}
