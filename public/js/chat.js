const socket = io();

const roomForm = document.getElementById("roomForm");
const roomSelect = document.getElementById("roomSelect");
const usernameInput = document.getElementById("username");
const roomSelectContainer = document.getElementById("roomSelectContainer");
const chatContainer = document.getElementById("chatContainer");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const userJoinMessage = document.getElementById("userJoinMessage");

let username, room;

roomForm.addEventListener("submit", (e) => {
  e.preventDefault();
  username = usernameInput.value.trim();
  room = roomSelect.value;
  if (!username || !room) return;

  socket.emit("joinRoom", { username, room });

  roomSelectContainer.style.display = "none";
  chatContainer.style.display = "block";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage", { message: input.value, username, room });
    input.value = "";
  }
});

socket.on("message", (msg) => {
  const item = document.createElement("li");
  item.className = "message";
  item.innerHTML = `<span class="bubble">${msg}</span>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
