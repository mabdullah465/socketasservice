import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "./db.js";
import dotenv from "dotenv";
import { Login, SignUp } from "./conrollers/authController.js";
import { CreateProject, GetAllProjects, GetProjectById } from "./conrollers/projectController.js";
import SendNotification from "./conrollers/notificationController.js";
import axios from "axios";

dotenv.config();

const app = express();
const server = http.createServer(app);


const activeConnections = [];

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.post("/api/signup", SignUp);
app.post("/api/login", Login);

app.get("/api/projects/all", GetAllProjects);
app.post("/api/projects", CreateProject);
app.get("/api/projects/:projectId", GetProjectById);

/**
 * NOTIFICATION RELAY ENDPOINT
 * POST /api/event/notification
 */
app.post("/api/event/notification", SendNotification);



const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.io = io;

io.use(async (socket, next) => {
  const { apikey, token } = socket.handshake.auth;

  if (!apikey || !token) {
    return next(new Error("Authentication failed: API Key and Token required"));
  }

  try {
    // 1. Verify Project API Key in our local DB
    const [projects] = await db.query("SELECT * FROM projects WHERE api_key = ?", [apikey]);
    if (projects.length === 0) {
      return next(new Error("Invalid API Key"));
    }
    const project = projects[0];

    // 2. Verify Token via the Project's specific Auth Endpoint
    const authUrl = `${project.base_url}${project.authendpoint}`;
    const response = await axios.get(authUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    // 3. Attach User & Project data to socket (Assuming response.data contains user info)
    if (response.status === 200) {
      // Adjust this based on your project's auth response structure
      const userData = response.data.user || response.data; 
      socket.user = {
        id: userData.id,
        email: userData.email,
        projectId: project.id
      };
      next();
    } else {
      next(new Error("External Authentication failed"));
    }
  } catch (err) {
    next(new Error("Socket Auth Error: " + err.message));
  }
});

io.on("connection", (socket) => {
  const userId = Number(socket.user.id);
  
  // Store user in onlineUsers map
  onlineUsers[userId] = socket.id;
  
  // Also join a room for the project ID to allow broad-project notifications
  socket.join(socket.user.projectId);

  console.log(`User ${userId} connected on Socket ${socket.id}`);

  socket.on("disconnect", () => {
    delete onlineUsers[userId];
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on http://localhost:${PORT}`);
});
