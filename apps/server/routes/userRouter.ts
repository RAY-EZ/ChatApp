import express,{NextFunction, Request, Response} from 'express';
import User from '../models/users';
import crypto from 'crypto';
import AppError from '../utilities/appError';
import {body} from 'express-validator';
const Router = express.Router()

Router.get('/',(req: Request, res: Response)=>{
  res.send('user Router')
})

/**
 * Sign Up
 */
Router.post(
  '/signup',
  body('username')
    .notEmpty()
    .withMessage("required username")
    .trim()
    .toLowerCase()
    .isLength({max:10})
    .matches(/^(?=.{4,10}$)[a-z][a-z0-9_]*$/)
    .withMessage("invalid username")
    ,
  body('password')
    .notEmpty()
    .withMessage("required password")
    .trim()
    .isLength({min:2 ,max:20})    // update min value
    .withMessage("password length should be between 8 and 20"),
  async (req: Request, res: Response, next: NextFunction)=>{
  // Validated email // Password shared over tls
  const {username, password, name}= req.body;
  
  const checkExist = await User.findOne({ username });
  if(checkExist) {
    return next(new AppError('username is taken', 400))
  }

  // if(password.length < 8){
  //   incude constraint on schema as well
  //   return next(new AppError('password length must be between 8 and 20',400))
  // }
  const user = await User.build({
    username,
    password
  })
  user.save();
  res.statusCode = 200;
  res.send("success");
})


/** Login */
Router.post('/login', async (req: Request, res: Response, next: NextFunction)=>{

  res.redirect(308,'/auth/login');
})

exports.getById = (req: Request, res: Response, next: NextFunction) => {
  const user = User.findById(req.params.userId)
  if(!user){
    return next(new AppError('user not found',404))
  }
  res.status(200).send({
    user
  });
};

export default Router;