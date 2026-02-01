import express from 'express';
import {createUser} from '../controllers/userController.js';
import {getUser} from '../controllers/userController.js';
import {loginUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.get('/', getUser);
userRouter.post('/login', loginUser);


export default userRouter;