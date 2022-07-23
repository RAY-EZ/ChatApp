import express, {NextFunction, Request, Response} from 'express';
import cookieParser from 'cookie-parser'

import UserRouter from './routes/userRouter';
import AuthRouter from './routes/authRouter';
import GroupRouter from './routes/groupRouter';
import AppError from './utilities/appError';

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

app.get('/api/', (req, res)=>{
    res.send('server is up and running');
})

app.use('/api/user', UserRouter );
app.use('/api/auth', AuthRouter);
app.use('/api/group', GroupRouter);;

app.use('*', (req:Request, res: Response)=>{
  res.statusCode = 404;
  res.send('<h1>not found<h1>')
})

app.use((error: AppError, req: Request, res: Response, next: NextFunction)=>{
  console.log("Error handler middleware", error.message)
  res.statusCode = error.statusCode;
  res.send({
    status: error.status,
    message: error.message
  })
})

export default app;