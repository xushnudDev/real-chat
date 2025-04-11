const socket = io(); 
const form = document.getElementById('form');
const input = document.getElementById('input');
const username = document.getElementById('username');
const messages = document.getElementById('messages');

socket.on("load messages", (messages) => {  
    messages.forEach(message => {
        addMessage(`${message.username}: ${message.message}`);
    });
});

socket.on('new message', (message) => {  
    addMessage(`${message.username}: ${message.message}`);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value && username.value) {
        socket.emit('send message', {  
            username: username.value,
            message: input.value
        });
        input.value = '';    
    }
});

const addMessage = (message) => {
    const item = document.createElement('li');
    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
};
