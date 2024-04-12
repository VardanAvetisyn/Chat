const socket = io();
const chatForm = document.getElementById("chat-form");
const container = document.querySelector(".chat-messages");

function outputMsg (m){

  const div = document.createElement('div');
  
  
  div.classList.add('message');
  
  div.innerHTML = `<p class='meta'>${m.username}
  <span>${m.time}</span></p><p class='text'>${m.message}</p>`;
  container.appendChild(div);
  
  }

chatForm.addEventListener("submit",(e) => {
  e.preventDefault();
  if(e.target.elements.msg.value){
    const msg = e.target.elements.msg.value;
    e.target.elements.msg.value = "";
    socket.emit("chatMsg",msg);
  }
  
})
socket.on('message',(data) =>{
  outputMsg(data);
  container.scrollTop = container.scrollHeight;
})