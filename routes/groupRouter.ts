import express, {Request, Response, NextFunction } from 'express';
import {body, validationResult, param} from 'express-validator';
import { userAttrs } from '../models/users';
import mongoose from 'mongoose';
import Group, { memberLevel, groupAttr} from '../models/groups';
import Query from '../utilities/query'
import { isLoggedIn } from '../controller/authController';
import AppError from '../utilities/appError';
import Redis from '../redis'
const Router = express.Router();

Router.get('/search', isLoggedIn, async (req: Request, res: Response, next: NextFunction)=>{
  // Return groups user belong to then unknown groups -- general search
  // return cursor to next page -- skipping and limiting ...
  // console.log(res.locals.currentUser.id)
  // console.log(req.query)
  const groupQuery = Group.find({},  {
    name:1,
    isProtected:1,
    members:1,
    created_at:1, 
    g_id:1,
    isMember: { 
      $cond : { 
        if : { 
          $eq: [ {$indexOfArray: ["$members.user", res.locals.currentUser._id]}, -1]}, 
          then: false, 
          else: true
        }
      }
    });
  const group = await new Query<mongoose.HydratedDocument<groupAttr>>(groupQuery,req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .query
    
  res.send(group)
})

Router.get('/', isLoggedIn,async (req: Request, res: Response, next: NextFunction)=>{
  const { id } = res.locals.currentUser

  const groups = await Group.find({"members.user": id}).populate({ path: 'members.user'});

  res.send({
    length: groups.length,
    data:[
      ...groups
    ]
  })
})

Router.get('/:groupid', async (req: Request, res: Response, next: NextFunction)=>{
  const groupId = req.params.groupid as string;

  if(!mongoose.isValidObjectId(groupId)){
    return next(new AppError('invalid id', 400))
  }
  const group = await Group.findById(groupId).populate({path: 'members.user'})

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

Router.get('/:groupid/active', isLoggedIn,async (req: Request, res: Response, next: NextFunction)=>{
  
  const activeCount = await Redis.instance.SCARD(req.params.groupid)
  res.send({
    activeCount,
    groupid: req.params.groupid
  })
})

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
  let isMemberInGroup = await Group.isMemberInGroup(group.id, currentUser.id)
  console.log(currentUser.id, currentUser._id);
  if(isMemberInGroup) {
    return res.send({
      length: 1,
      data: [
        group
      ]
    })
  }
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