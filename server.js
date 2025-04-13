import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.config.js";
import handledSocket from "./sockets/chat-app.js";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }  
});

const startServer = async () => {
    try {
        await connectDB();

        const __dirname = path.resolve();

        app.use(express.static(path.join(__dirname, 'public')));

        handledSocket(io);

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'chat.html'));
        });
        
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    } catch (error) {
        console.error("🔥 Error connecting to the database:", error);
        process.exit(1);  
    }
};

startServer();
