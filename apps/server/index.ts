import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import Socket from './socket'

const PORT = process.env.PORT || 5000;

const router = require('./app');

const app = express();
app.use((req:Request, res: Response, next: NextFunction)=>{
  res.setHeader('Access-Control-Request-Method', 'POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');

  next()
})
app.use(express.json());
const server = http.createServer(app);
Socket(server);

app.use(router);

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