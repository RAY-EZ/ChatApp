import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {userAttrs} from '../../models/users';

export function createNewUser(seed: mongoose.Types.ObjectId | string){
  if(seed){
    return {
      _id: new mongoose.Types.ObjectId(seed),
      username: 'rayez',
      password: 'test12'
    }
    
  }
  return {
    _id: new mongoose.Types.ObjectId(),
    username: 'rayez',
    password: 'test12'
  }
  
}

export function isLoggedIn(req:Request, res:Response, next: any){
  res.locals.currentUser = createNewUser(req.body.currentUserId)
  next();
}

export function login(){

}
export function logout(){

}