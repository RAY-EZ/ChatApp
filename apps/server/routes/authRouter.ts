import express, {Request, Response, NextFunction} from 'express';
import * as authController from '../controller/authController';
import { body } from 'express-validator';
const router = express.Router();

router.post(
  '/login',
    body('username')
    .notEmpty()
    .withMessage("required username")
    .trim()
    .toLowerCase()
    .isLength({max:10})
    .matches(/^(?=.{4,10}$)[a-z][a-z0-9_]*/)
    .withMessage("invalid username")
    ,
  body('password')
    .notEmpty()
    .withMessage("required password")
    .trim()
    .isLength({min:2 ,max:20})    // update min value
    .withMessage("password length should be between 8 and 20"), 
    
  authController.login);

router.post('/logout', authController.logout);

export default router;