// import { API_URL } from "@/constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export async function connectSocket(): Promise<Socket> {
//   const token = await AsyncStorage.getItem("token");

//   console.log("hola");

//   if (!token) {
//     throw new Error("No token found in storage, User must be logged in");
//   }

//   if (!socket) {
//     socket = io(API_URL, {
//       auth: {
//         token: token,
//       },
//     });

//     console.log({ socket });

//     console.log("1");

//     // Wait for the socket to connect
//     await new Promise((resolve) => {
//       socket?.on("connect", () => {
//         console.log("Socket connected", socket?.id);
//         resolve(true);
//       });
//     });

//     console.log("2");

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     console.log("3");
//   }
//   return socket;
// }

// export function getSocket(): Socket | null {
//   return socket;
// }

// export function disconnectSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }

import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem("token");
  if (!token)
    throw new Error("No token found in storage, user must be logged in");

  if (!socket) {
    socket = io(API_URL, {
      auth: { token },
      transports: ["websocket"], // force websocket for RN
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    await new Promise<void>((resolve, reject) => {
      socket?.once("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        resolve();
      });
      socket?.once("connect_error", reject);
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));
  }

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
