import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import Socket from './socket';
import cookieParser from 'cookie-parser';
import "dotenv/config";

const PORT = process.env.PORT || 5000;

const router = require('./app');

const app = express();

app.use((req:Request, res: Response, next: NextFunction)=>{
  res.setHeader('Access-Control-Request-Method', 'POST,GET,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers',req.get('access-control-request-headers') || '*' );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // console.log(req.get('access-control-request-headers'));
  if(req.method == 'OPTIONS'){
    res.statusCode = 200;
    res.send();
    return;
  }

  next();
})
app.use(cookieParser());

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