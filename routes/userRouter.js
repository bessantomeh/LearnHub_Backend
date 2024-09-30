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
userRouter.get('/:userId',authorizeUser([roles.admin]),userController.getUserById);
userRouter.get('/users/search/name/:username',authorizeUser([roles.admin]),userController.searchUserByName)
userRouter.get('/users/search/email/:email',authorizeUser([roles.admin]),userController.searchUserByEmail)
router.post('/createUser',authorizeUser([roles.admin]), userController.createUser)
router.delete('/deleteUser/:userId',authorizeUser([roles.admin]),userController.deleteUserById)
router.put("/updateUserPassword/:userId",authorizeUser([roles.admin]), userController.updateUserPassword);
router.put("/updateUserbyAdmin/:userId",authorizeUser([roles.admin]), userController.updateUserByAdmin);



export default userRouter; 
