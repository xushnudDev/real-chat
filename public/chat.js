const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const usernameInput = document.getElementById('username');
const messagesList = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const userJoinMessage = document.getElementById('userJoinMessage');


let username = '';

usernameInput.addEventListener('change', (e) => {
  username = e.target.value;
  socket.emit('new_user', `${username}`);  
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value;
  if (message.trim() !== '') {
    socket.emit('send_message', { username, message: message });
    input.value = '';
  }
});

socket.on('receive_message', (data) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('message'); 
  messageElement.textContent = `${data.username}: ${data.message}`;
  messagesList.appendChild(messageElement);
});

socket.on('load_messages', (messages) => {
  messages.forEach((data) => {
    const messageElement = document.createElement('li');
    const isMessage = data.username === username;

    messageElement.classList.add('message');
    messageElement.classList.add(isMessage ? 'left' : 'right');

    const time = new Date(data.timestamp).toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});

    messageElement.innerHTML = `
    <div class="bubble">
      <strong>${data.username}</strong>
      <p>${data.message}</p>
      <span class="time">${time}</span>
    </div>`;
    messagesList.appendChild(messageElement);
    messagesList.scrollTop = messagesList.scrollHeight;
  });
});

socket.on('new_message', (data) => {
    const messageElement = document.createElement('li');
    const isMessage = data.username === username;

    messageElement.classList.add('message');
    messageElement.classList.add(isMessage ? 'left' : 'right');

    const time = new Date(data.timestamp).toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});

    messageElement.innerHTML = `
    <div class="bubble">
      <strong>${data.username}</strong>
      <p>${data.message}</p>
      <span class="time">${time}</span>
    </div>`;
    messagesList.appendChild(messageElement);
    messagesList.scrollTop = messagesList.scrollHeight;
})

input.addEventListener('input', () => {
  if (input.value.trim() !== '') {
    socket.emit('typing', username);
  }
  if (!username.trim()) {
    alert("Iltimos, ismingizni kiriting!");
    return;
  }
  
});

socket.on('typing', (username) => {
  typingIndicator.innerText = `${username} yozmoqda...`;
});

socket.on('user_joined', (message) => {
  userJoinMessage.innerText = message;
  setTimeout(() => {
    userJoinMessage.innerText = '';
  }, 1000);
});
