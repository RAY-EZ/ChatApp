import http from 'http';
import { JSONCookie } from 'cookie-parser';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import User from '../models/users';
import Group from '../models/groups';
import Redis  from '../redis';
import {nanoid} from 'nanoid';

import { isValidJWT } from '../controller/authController';

export default async (server: http.Server)=>{
  const io = new socketio.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      allowedHeaders: ['GET','POST'],
    },
    transports: ['websocket'],
  });

  io.serverSideEmit
  io.on('connection', async (socket)=>{
    // const client = RedisClient;
    
    console.log(socket.id)
    // console.log(socket.handshake.headers);
    if(!('cookie' in socket.handshake.headers)) return socket.disconnect(true);
    // verify user exists and JWT
    
    const CookieEntries = socket.handshake.headers.cookie.split(';')
      .map((cookieString)=> cookieString.split('=')); // [[jwt,'lskdfl'],[key,'value']] basically multi-dimensional array
    
    const Cookies = Object.fromEntries(CookieEntries)
    if(!('jwt' in Cookies)) return socket.disconnect(true);
    const payload = isValidJWT(Cookies.jwt);

    // verify user 
    if(!payload.id) return socket.disconnect(true);

    const user = await User.findById(payload.id); 
      socket.on('join',async (group)=>{
        // verify user is in group and group exists
        if(!mongoose.isValidObjectId(group.id)) return socket.emit('join:error',{
          status: "error",
          message: "invalid group id"
        });
        let isUserInGroup = await Group.isMemberInGroup(group.id ,user.id);
        console.log('ingroup', isUserInGroup);
        if(!isUserInGroup) return socket.emit('join:error',{
          status: "error",
          message: "you are not member of this group"
        });

        // compare password with group password
        console.log(group.id)
        
        // add user to a room
        socket.join(group.id);
        // add user to group in redis
        console.log(user.id);
        await Redis.instance.SADD(group.id,`${user.id}`)
        // set user status from idle to groupid
        await Redis.instance.SET(user.id, group.id);
        
        // change user activity from idle to group info
        
        console.log('\x1b[0;32m%s\x1b[0m',`${user.username} has joined ${group.name}`)
        socket.to(group.id).emit('user:join', {
          userId: user.id,
          userName: user.username
        })    
        
        const groupData = await Redis.instance.SMEMBERS(group.id);
        socket.to(group.id).emit('active:update',{
          members: groupData,
          groupId: group.id,
          activeCount: groupData.length
        })

        /* Fix This Later */
        io.emit('active:update',{
          members: groupData,
          groupId: group.id,
          activeCount: groupData.length
        })
        // io.emit('welcome', "welcom to chat app");
        // setTimeout(()=>{
        //   socket.emit('newjoin', {
        //     groupId: group.id
        //   })
        // }, 3000)
        socket.emit('welcome', "welcome to chat app");
        // socket.to(socket.id).emit('welcome', "welcom to chat app")
      });
      
      socket.on('leave', async ()=>{
        // verfiy user is active in group
        const userGroup = await Redis.instance.GET(user.id);
        if(!userGroup || userGroup == 'idle') return;
        await Redis.instance.SISMEMBER(userGroup, user.id);
        await Redis.instance.SREM(userGroup, user.id);
        //broadcast user left event in group
        socket.to(userGroup).emit('user:left',{ userId: user.id, userName: user.username});

        socket.leave(userGroup);
        // change user activity to idle
        await Redis.instance.SET(user.id, 'idle');

        const groupData = await Redis.instance.SMEMBERS(userGroup); // groupid fetched from redis
        socket.to(userGroup).emit('active:update',{
          members: groupData,
          groupId: userGroup,
          activeCount: groupData.length
        })
        io.emit('active:update',{
          members: groupData,
          groupId: userGroup,
          activeCount: groupData.length
        })

        console.log('\x1b[0;31m%s\x1b[0m',`${user.username} left`);
      })

      socket.on('sendMessage', async ({message})=>{
        // get current group user has joined 
        const userGroup = await Redis.instance.GET(user.id);
        // broadcast message to group
        let stamp = new Date().toUTCString();
        let msgid = nanoid()
        socket.to(userGroup).emit('message', {
          message,
          msgid,
          stamp,
          sender: {
            userId: user.id,
            userName: user.username
          }
        })

        socket.emit('message:ack', {
          msgid,
          stamp: stamp,
          message
        })
        console.log('\x1b[47m\x1b[0;35m%s\x1b[0m', `message by ${user.username}`);
      });

      socket.on('disconnect', ()=>{
        // check user is redis 
        // emit disconnected e
          // const user:any = User.removeUser(socket.id);
          // if(user){
          //     io.to(user.room).emit('message', { user:'admin', text:`${user.name} has left.`});
          // }
          console.log('disconnected')
          socket.disconnect(true);
      })
  });
  return io;
}
