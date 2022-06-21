import express,{NextFunction, Request, Response} from 'express';
import User from '../models/users'
const Router = express.Router()

Router.get('/',(req: Request, res: Response)=>{
  res.send('user Router')
})

Router.post('/signup',async (req: Request, res: Response, next: NextFunction)=>{
  // Validated email // Password shared over tls
  const {username, password, name}= req.body;
  
  const checkExist = await User.findOne({ username });
  if(checkExist) {
    next(new Error('username is taken'))
  }
  const user = await User.build({
    name,
    username,
    password
  })
  user.save();
  res.statusCode = 200;
  res.send("success");
})

export default Router;