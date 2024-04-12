const express = require("express");
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require("./app/utils/messages");
const bodyParser = require("body-parser")
const fs = require('fs')

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended : false}));
const server = http.createServer(app);
const io = socket(server);

const usersFilePath = path.join(__dirname,"public/users.json")

app.post("/signUp", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  console.log(username);
  console.log(password);
  fs.readFile(usersFilePath,"utf8", (err,data) => {
    if(err){
      console.error("Error read file ",err);
      return res.status(500).json({message: `internal server error reading file ${err}`})
    }
    let users =[]
    if(data){
      try{
        users = JSON.parse(data);
      }catch(parseErr) {
        console.error("Error parcing user file" + parseErr);
        return res.status(500).json({message: `internal server error ${parseErr}`})
      }
    }
    const existingUser = users.find((user) => user.username === username);
    if(existingUser){
      return res.status(400).json({message: "Username already exists"})
    }
    const newUser = {
      username : username,
      password: password
    }
    users.push(newUser)
  })
})

io.on('connection', (socket) => {
    console.log('User Connected Successful!');
    socket.emit("message",formatMessage("BOT", "Wellcome to server"))
    socket.broadcast.emit("message",formatMessage("BOT", "A new user joind"))
    socket.on('chatMsg',(m) => {
      io.emit("message",formatMessage("USER",m))
    })
    socket.on('disconnect',() => {
      io.emit("message",formatMessage("BOT", "A user has left"))
    })
});

server.listen(PORT, () => {
console.log(`server is running on port ${PORT}`);
});