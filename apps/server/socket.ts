import http from 'http';
import socketio from 'socket.io';
import * as User from './users';

export default (server: http.Server)=>{
  const io = new socketio.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      allowedHeaders: ['GET','POST'],
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true
  });
  
  io.on('connection', (socket)=>{
    console.log('new connection');

      socket.on('join',({name, room}, callback)=>{
  
          const {error, user} = User.addUser({ id: socket.id, name, room});
  
          if(error) return callback(error);
  
          socket.emit('message', { user:'admin', text:`Hi, ${user.name} welcome to the room ${user.room}. We hope to keep healthy conversation Up!.`})
          socket.broadcast.to(user.room).emit('message', { user:'admin', text:`${user.name} has joined!✌🏻 🎉👋 `})
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
          // const user:any = User.removeUser(socket.id);
          // if(user){
          //     io.to(user.room).emit('message', { user:'admin', text:`${user.name} has left.`});
          // }
      })
  });

}
