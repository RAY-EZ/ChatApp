import "dotenv/config";

import mongoose from 'mongoose';
import * as http from 'http';
import Socket from './socket/socket';
import app from './app';
import Redis from './redis';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
// const server = http.createServer();

// server.on('connect', ()=>{ console.log('new connection')})
server.on('connection', (socket)=>{
   console.log('connection', socket.remoteAddress)
  //  console.log(socket.address());
  // //  conn.write('hello')
  // console.log(socket.remoteAddress)
  //  let ping = 5000, count=1;
  //  setInterval(()=> socket.write(`${ping * count++}`), ping)
  })
// server.maxConnections = 3;
async function start(){
  try{
    /* websocket */
    await Socket(server);

    /* mongodb connection */
    mongoose.connect('mongodb://localhost:27017/chat_app',(err)=>{
      if(!err){
        console.log('\x1b[0m%s\x1b[1;35m%s\x1b[0m\n','', 'connected to mongodb')
      }
    })

    mongoose.set('debug', true);

    /* connecting to redis */
    await Redis.connect();

    /* starting http server */
    server.listen(5000, ()=> console.log('\x1b[0m%s\x1b[1;35m%s\x1b[0m','Server Listening on Port ->', 'http://localhost:5000'))
  }
  catch(e){
    console.log('\x1b[0;33m%s\x1b[0m','error starting app')
    console.log(e);

  }
}

start();