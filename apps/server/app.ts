import express, {NextFunction, Request, Response} from 'express';
import UserRouter from './routes/userRouter';
import AuthRouter from './routes/authRouter';
import AppError from './utilities/appError';

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('server is up and running');
})

router.use('/user', UserRouter );
router.use('/auth', AuthRouter);

router.use('*', (req:Request, res: Response)=>{
  res.statusCode = 404;
  res.send('<h1>not found<h1>')
})

router.use((error: AppError, req: Request, res: Response, next: NextFunction)=>{
  console.log("Error handler middleware", error.message)
  res.statusCode = error.statusCode;
  res.send({
    status: error.status,
    message: error.message
  })
})
module.exports = router;