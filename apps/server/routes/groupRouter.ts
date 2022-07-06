import express, {Request, Response, NextFunction } from 'express';
import {body, validationResult, param} from 'express-validator';
import { userAttrs } from '../models/users';
import mongoose from 'mongoose';
import Group, { memberLevel} from '../models/groups';

import { isLoggedIn } from '../controller/authController';
import AppError from '../utilities/appError';

const Router = express.Router();

Router.post('/create', isLoggedIn, async (req: Request, res: Response, next:NextFunction)=>{
  const {name, isProtected} = req.body as {  name: string; isProtected: boolean; password?: string; }
  const { currentUser } = res.locals as { currentUser:  mongoose.HydratedDocument<userAttrs>}
  try{
    let group = Group.build({
      name,
      isProtected,
    })

    // console.log(currentUser._id);
    // First member has the higest privileges
    group.members = [{ user: currentUser._id, level: memberLevel.admin }];
     await group.save();

    res.statusCode = 201;
    res.json({
      length: 1,
      data: [
        group
      ]
    })
  }catch(e){
    res.send(e.message)
  }

})


Router.get('/:groupid', async (req: Request, res: Response, next: NextFunction)=>{
    const groupId = req.params.groupid as string;

    if(!mongoose.isValidObjectId(groupId)){
      return next(new AppError('invalid id', 400))
    }
    const group = await Group.findById(groupId)

    // console.log(group);
    if(!group){
      return next(new AppError('not found', 404));
    }
    res.statusCode = 200;
    res.json({
      length: 1,
      data: [
        group
      ]
    })
})

Router.post('/:groupid/add/:userid', async (req: Request, res: Response, next: NextFunction)=>{
  // Get all the users by ids
  const { groupid, userid }  = req.params;
  if(!mongoose.isValidObjectId(userid) || !mongoose.isValidObjectId(groupid)){
    return next(new AppError('invalid request',400));
  }
  
  let group = await Group.findById(groupid);
  
  let updatedGroup = group.AddMemberById(userid);

  await updatedGroup.save();

  res.send('success');
})

Router.post('/:groupid/remove/:userid', async(req: Request, res: Response, next: NextFunction)=>{
  const group = await Group.findById(req.params.groupid);
  group.RemoveMemberById(req.params.userid);
  res.send({});
})

Router.put('/:groupid', async (req: Request, res: Response, next: NextFunction)=>{
  // Update group by id
})

Router.post('/:groupid/join', isLoggedIn, async (req: Request, res: Response, next: NextFunction)=>{
  // allow user to join the open group
  const { groupid }  = req.params;
  const {currentUser} = res.locals
  // console.log("controller",currentUser)
  if(!mongoose.isValidObjectId(currentUser._id) || !mongoose.isValidObjectId(groupid)){
    return next(new AppError('invalid request',400));
  }
  
  let group = await Group.findById(groupid);
  
  let updatedGroup = group.AddMemberById(currentUser._id);

  await updatedGroup.save();

  res.statusCode = 200;
  res.json({
    length: 1,
    data: [
      updatedGroup
    ]
  });
})

Router.patch('/:groupid/leave', isLoggedIn,  async (req: Request, res: Response, next: NextFunction)=>{
  // Update remove user from group
  const { groupid }  = req.params;
  const {currentUser} = res.locals
  // console.log("controller",currentUser)
  if(!mongoose.isValidObjectId(currentUser._id) || !mongoose.isValidObjectId(groupid)){
    return next(new AppError('invalid request',400));
  }

  let group = await Group.findById(groupid);
  
  let updatedGroup = await group.RemoveMemberById(currentUser._id);
  
  await updatedGroup.save();

  res.statusCode = 200;
  res.json({});
})

export default Router;