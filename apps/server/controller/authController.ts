import {Request, Response, NextFunction} from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import User from '../models/users';
import AppError from '../utilities/appError'
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
/**
 * Days * hours * min * sec * mil secs
 */
const JWT_COOKIE_EXPIRES = +process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000;

async function comparePassword (storedPassword: string, password: string){
  let [salt, hasedPassword] = storedPassword.split('.');
  const hmac = crypto.createHmac('sha256', salt);

  const hash = hmac.update(password).digest().toString('base64');
  
  if(hash === hasedPassword) return true;

  return false;
}

function signToken(id: string){
  console.log('expires in', process.env.JWT_EXPIRES_IN)
  return jwt.sign({ id, iat: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: JWT_COOKIE_EXPIRES
  })
}

/** Utilites */

export async function isLoggedIn(req: Request, res: Response, next: NextFunction){
  // if(!req.cookies.jwt) 

  if(!req.cookies?.jwt) return next(new AppError('not authorized', 401));

  const payload: payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) as payload;

  if(!mongoose.isValidObjectId(payload.id)){
    return next(new AppError('not a valid token', 401));
  }

  const user = await User.findById(payload.id);
  if(!user) {
    return next(new AppError('invalid token or userid', 401));
  }

  // infrences type but 
  res.locals = {
    currentUser: user
  }

  //this doesn't 
  // res.locals.currentUser = user;
  next();
}


/** 
 *  route controllers
 */

export async function login(req: Request, res: Response, next: NextFunction){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(new AppError(errors.array()[0].msg, 400))
  }
  
  /** Expecting Sanitized and Verified Field */
  const { username, password } = req.body;
  const user = await User.findOne({ username});
  
  if(!user) return next(new AppError('Incorrect username or password', 401));

  const storedPassword = user.password;
  const token = signToken(user.id);

  const arePasswordsSame = await comparePassword(storedPassword,password);

  user.password = undefined;
  if(arePasswordsSame){
    res.cookie('jwt', token, { expires: new Date(Date.now() + JWT_COOKIE_EXPIRES), httpOnly: true});
    console.log(token);
    res.statusCode = 200;
    res.send({
      user
    });

    console.log('login successful')
  } else {
    res.statusCode = 401;
    res.send("failed")
  }
}

interface payload extends jwt.JwtPayload{
  id: string;
  iat: number;
  exp: number;
}

export async function logout(req: Request, res: Response, next: NextFunction){
  
  res.statusCode = 200;
  res.clearCookie('jwt')
  res.send("success");
}

