import express, {NextFunction, Request, Response} from 'express';
import UserRouter from './routes/userRouter';
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('server is up and running');
})

router.use('/user', UserRouter );

router.use('*', (req:Request, res: Response)=>{
  res.statusCode = 404;
  res.send('<h1>not found<h1>')
})

router.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
  console.log(error.message);
})
module.exports = router;