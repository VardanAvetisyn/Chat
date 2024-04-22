const socket = io();
const currentUrl = window.location.href;
const params = new URLSearchParams(window.location.search);
// const url = new URL(currentUrl);
const token = params.get("token");
if (token) {
  localStorage.setItem("token", token);
}

const tokenInStorage = localStorage.getItem("token");
if (!tokenInStorage) {
  const message = "You are not authorized to access this page.";
  window.location.href = `../index.html?message=${message}&status=fail`;
}

const chatForm = document.getElementById("chat-form");
const messagesContainer = document.querySelector(".chat-messages");

function outputMsg(data) {
  const div = document.createElement("div");

  const container = document.querySelector(".chat-messages");
  div.classList.add("message");

  div.innerHTML = `<p class='meta'>${data.username}
<span>${data.time}</span></p><p class='text'>${data.text}</p>`;
  container.appendChild(div);
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  socket.emit("chatMsg", msg);
});

socket.on("message", (data) => {
  const currentTokenInStorage = localStorage.getItem("token");
  if (!currentTokenInStorage) {
    const message = "You are not authorized to access this page.";
    return (window.location.href = `../index.html?message=${message}&status=fail`);
  }
  outputMsg(data);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
socket.emit("joinRoom",token)
