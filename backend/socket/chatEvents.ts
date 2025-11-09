import { Server as SocketIOServer, Socket } from "socket.io";
import Conversation from "../models/Conversation";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
  socket.on("newConversation", async (data) => {
    console.log("newConversation event", data);

    try {
      if (data.type == "direct") {
        const existingConvversation = await Conversation.findOne({
          type: "direct",
          participants: { $all: data.participants, $size: 2 },
        })
          .populate({
            path: "participants",
            select: "name avatar email",
          })
          .lean();

        if (existingConvversation) {
          return socket.emit("newConversation", {
            success: true,
            data: { ...existingConvversation, isNew: false },
          });
        }
      }

      // create new conversation
      const newConversation = new Conversation({
        type: data.type,
        name: data.name || "", // name can be empty for direct conversations
        avatar: data.avatar || "",
        participants: data.participants,
        createdBy: socket.data.userId,
      });

      // get all connected users
      const connectedSockets = Array.from(io.sockets.sockets.values()).filter(
        (s) => data.participants.includes(s.data.userId)
      );

      
    } catch (error: any) {
      console.log("newConversation error:", error);
      socket.emit("newConversation", {
        success: false,
        msg: error.message || "Failed to create conversation",
      });
    }
  });
}
