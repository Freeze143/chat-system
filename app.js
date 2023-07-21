var express = require('express');
var http = require('http');
const app = express();

var server = http.createServer(app);

const io = require("socket.io")(server, 
  {
    allowEIO3: true, // false by default
    cors: {
      origin: ["http://localhost:8080","http://localhost:8082"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    },
    upgradeTimeout: 30000,
    maxHttpBufferSize: 25e8
  });

var path = require('path');

app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


var connectedUsers = [];

io.on('connection', (socket) => {

  socket.on('send-img', (data) => {

    console.log(data)
    
    let recipientID = connectedUsers.filter(aUser => aUser.username === data.username).length ? connectedUsers.filter(aUser => aUser.username === data.username)[0].clientID : 0;
    var d = new Date();
    var datetime = d.toLocaleString();

    console.log("img-rec", recipientID)
    
    if(recipientID)
      socket.to(recipientID).emit('send-img', {
        senderName: data.username,
        content: data.content,
        userID : socket.id,
        datetime:datetime,
        name:data.name,
        src:data.src
        
      });
   
  });

 
  socket.on('joining msg', (username, callBack) => {


    let idx = connectedUsers.findIndex(el => el.username === username);
    console.log("idx----------------", idx)
    if(idx < 0)
      connectedUsers.push({username, clientID: socket.id});
    else
      connectedUsers[idx].clientID = socket.id;

    console.log(connectedUsers)
    console.log("in")
    // send id back
    callBack(socket.id); 

    let recipientID = connectedUsers.filter(aUser => aUser.username === 'admin').length ? connectedUsers.filter(aUser => aUser.username === 'admin')[0].clientID : 0;
    console.log("id============================", recipientID)

    if(recipientID)
      socket.to(recipientID).emit('connected-users', {
        username,
        userID : socket.id
      });

  });
  
  socket.on('disconnect', (error) => {
    console.log('user disconnected');
    console.log(error);
  });

  socket.on('chat message', (data) => {

    let recipientID = connectedUsers.filter(aUser => aUser.username === data.username).length ? connectedUsers.filter(aUser => aUser.username === data.username)[0].clientID : 0;
    var d = new Date();
    var datetime = d.toLocaleString();

    if(recipientID)
      socket.to(recipientID).emit('chat message', {
        senderName: data.username,
        msg: data.msg,
        userID : socket.id,
        datetime:datetime
      });
 
  });




});



server.listen(8081, () => {
  console.log('Server listening on :8081');
});