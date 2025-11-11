import { Server as SocketIOServer, Socket } from "socket.io";
import Conversation from "../models/Conversation";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
  socket.on("getConversations", async (data) => {
    console.log("getConversations event", data);
    try {
      const userId = socket.data.userdId;

      if (!userId) {
        return socket.emit("getConversations", {
          success: false,
          msg: "User not authenticated",
        });
      }

      //   find all conversations of the user
      const conversations = await Conversation.find({
        participants: userId,
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: "lastMessage",
          select: "content senderId attachment createdAt",
        })
        .populate({
          path: "participants",
          select: "name avatar email",
        })
        .lean();

      socket.emit("getConversations", {
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      console.log("getConversations error:", error);
      socket.emit("getConversations", {
        success: false,
        msg: error.message || "Failed to fetch conversations",
      });
    }
  });

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
      const conversation = await Conversation.create({
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

      //   join this conversation by all online participatns
      connectedSockets.forEach((participatnsSocket) => {
        participatnsSocket.join(conversation._id.toString());
      });

      //   send back the new conversation

      const populateConversation = await Conversation.findById(
        conversation._id
      ).populate({
        path: "participants",
        select: "name avatar email",
      });

      if (!populateConversation) {
        throw new Error("Failed to populate conversation");
      }

      //   emit conversation to all users
      io.to(conversation._id.toString()).emit("newConversation", {
        success: true,
        data: { ...populateConversation, isNew: true },
      });
    } catch (error: any) {
      console.log("newConversation error:", error);
      socket.emit("newConversation", {
        success: false,
        msg: error.message || "Failed to create conversation",
      });
    }
  });
}
