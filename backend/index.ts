import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import { initializeSocket } from "./socket/socket";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// initialize socket

initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is running on PORT", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to start server due to database error", err);
  });
