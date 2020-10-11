const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const User = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./app');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
    socket.on('join',({name, room}, callback)=>{

        const {error, user} = User.addUser({ id: socket.id, name, room});

        if(error) return callback(error);

        socket.emit('message', { user:'admin', text:`Hi, ${user.name} welcome to the room ${user.room}. We hope to keep healthy conversation Up!.`})
        socket.broadcast.to(user.room).emit('message', { user:'admin', text:`${user.name} has joined!✌🏻 🎉 `})
        socket.join(user.room);

        callback();
    });
    
    socket.on('sendMessage', (message, callback)=>{
        // Every Time Front End Emits event We search for Id 
        const user = User.getUser(socket.id);
        // Emiting event back to the room in which user exists
        io.to(user.room).emit('message', {user: user.name, text: message});
        callback();
    });

    socket.on('disconnect', ()=>{
        const user = User.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', { user:'admin', text:`${user.name} has left.`});
        }
    })
});

app.use(router);

server.listen(PORT, ()=> console.log(`Server Started Listening on Port ${PORT}`));