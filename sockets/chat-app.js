import message from "../models/message.js";
const handledSocket = async (io) => {
    io.on('connection', (socket) => {
        console.log("🔥 A new user connected");
        
        socket.on('new_user',(username) => {
            socket.username = username;
            io.emit('user_joined', `${username} qo\'shildi`);
        });
        message.find().sort({ timestamp: 1 }).limit(50).then(messages => {
            socket.emit('load_messages', messages);
        });
        socket.on('send_message', async (data) => {
            if (!socket.username) {
              console.error('Foydalanuvchi ismi aniqlanmagan!');
              return;
            }
            const newMessage = new message({
              username: socket.username,
              message: data.message,
              timestamp: new Date()
            });
            await newMessage.save();
            io.emit('new_message', newMessage);
          });
          
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        });
    })
};
export default handledSocket;