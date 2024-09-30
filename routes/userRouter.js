import { Router } from "express";
import { roles } from '../services/role.js';
import * as userController from '../controllers/userController.js'; 
import {authorizeUser} from "../middleware/authentication.js";

const userRouter = Router();

userRouter.get('/profile',authorizeUser([roles.user,roles.admin]),userController.getProfile)
userRouter.patch('/updatePassword',authorizeUser([roles.user,roles.admin]),userController.updatePassword)
userRouter.put("/updateUser",authorizeUser([roles.user,roles.admin]), userController.updateUser);
userRouter.get('/allUsers',authorizeUser([roles.admin]),userController.getAllUsers)
userRouter.delete('/delete',authorizeUser([roles.admin,roles.user]),userController.deleteUser)
userRouter.post('/signOut',authorizeUser([roles.admin,roles.user]),userController.signOut)



export default userRouter; 
