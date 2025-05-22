import Message from "../models/message.js"; 

export default (socket, io) => {
  console.log(`🟢 Socket ulandi: ${socket.id}`);

  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);

    const messages = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
    messages.forEach(msg => {
      socket.emit("message", `${msg.username}: ${msg.message}`);
    });

    socket.to(room).emit("message", `${username} xonaga qo‘shildi`);
  });

  socket.on("chatMessage", async ({ message, username, room }) => {
    const newMsg = new Message({ message, username, room }); // ✅
    await newMsg.save();
    io.to(room).emit("message", `${username}: ${message}`);
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter(r => r !== socket.id);
    rooms.forEach(room => {
      socket.to(room).emit("message", `❌ Foydalanuvchi chiqib ketdi`);
    });
  });
};
