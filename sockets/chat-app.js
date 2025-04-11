import message from "../models/message.js";

const handledSocket = async (io) => {
    io.on('connection', (socket) => {
        console.log("🔌 New user connected");

        message.find().sort({ timestamp: 1 }).limit(50).then(messages => {
            socket.emit("load messages", messages);  
        });

        socket.on("send message", async (messageData) => {  
            const newMessage = new message(messageData); 
            await newMessage.save();
            io.emit("new message", newMessage);
        });
    });
}

export default handledSocket;
