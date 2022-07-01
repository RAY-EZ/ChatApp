import "dotenv/config";

import mongoose from 'mongoose';
import * as http from 'http';
import Socket from './socket';
import app from './app';

const PORT = process.env.PORT || 5000;

// const server = http.createServer(app);
const server = http.createServer();
Socket(server);

async function start(){
  try{
    mongoose.connect('mongodb://localhost:27017/chat_app',(err)=>{
      if(!err){
        console.log('\x1b[0m%s\x1b[1;35m%s\x1b[0m','', 'connected to mongodb')
      }
    })
    server.listen(5000, ()=> console.log('\x1b[0m%s\x1b[1;35m%s\x1b[0m','Server Listening on Port ->', 'http://localhost:5000'))
  }
  catch(e){
    console.log('\x1b[0;33m%s\x1b[0m','error starting app')
    console.log(e);

  }
}

start();