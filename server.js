const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];


app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);


io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('login', (login) => {
    console.log(socket.id + ' has just logged in!');
    users.push(login);
    socket.broadcast.emit('login', login);
  });

  socket.on('newUser', (message) => {
    socket.broadcast.emit('newUser', message);
  })

  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    let leavingUser = users.filter(function(user){
      return user.id === socket.id;
    });
    // czy skoro wiem, że leavingUser jest tablicą z jednym obiektem, to mogę z tej informacji w taki sposób skorzystać, żeby usunąć usera?
    users.splice(leavingUser[0], 1);
    socket.broadcast.emit('leavingUser', ({author: 'Chat Bot', content: `${leavingUser[0].name} has left the conversation... :(`}));
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});