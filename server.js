import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.config.js";
import handledSocket from "./sockets/chat-app.js";
import path from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const startServer = async () => {
  try {
    await connectDB();

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({ extended: true }));

    app.engine("handlebars", exphbs.engine());
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "views"));

    io.on("connection",(socket) => {
      handledSocket(socket,io)
    })
    app.get("/", (req, res) => {
        res.render("home", { title: "Chat Rooms" });
      });
      

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🔥 Error connecting to the database:", error);
    process.exit(1);
  }
};

startServer();
