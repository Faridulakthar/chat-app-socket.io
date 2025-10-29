import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/User";
import { generateToken } from "../utils/token";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
  socket.on("testSocket", (data) => {
    socket.emit("testSocket", { msg: "Socket is working!!!" });
  });

  socket.on(
    "updateProfile",
    async (data: { name?: string; avatar?: string }) => {
      console.log("updateProfile event", data);

      const userId = socket.data.userId;

      if (!userId) {
        return socket.emit("updateProfile", {
          success: false,
          msg: "User not authenticated",
        });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { name: data.name, avatar: data.avatar },
          { new: true }
        );

        if (!updatedUser) {
          return socket.emit("updateProfile", {
            success: false,
            msg: "User not found",
          });
        }

        // generate new token
        const newToken = generateToken(updatedUser);

        socket.emit("updateProfile", {
          success: true,
          msg: "Profile updated successfully",
          data: {token: newToken},
          user: updatedUser,
        });
      } catch (error) {
        console.log("Error updating profile", Error);
        socket.emit("updateProfile", {
          success: false,
          msg: "Error updating profile",
        });
      }
    }
  );
}
