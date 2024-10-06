import { Router } from "express";
import { roles } from '../services/role.js';
import * as userController from '../controllers/userController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { validation } from './../middleware/requestValidation.js';
import * as validators from './../validation/userValidation.js';

const userRouter = Router();

userRouter.get('/profile',authorizeUser([roles.user,roles.admin]),userController.getProfile)
userRouter.patch('/updatePassword',authorizeUser([roles.user,roles.admin]),validation(validators.updatePassword),userController.updatePassword)
userRouter.put("/updateUser",authorizeUser([roles.user,roles.admin]), userController.updateUser);
userRouter.get('/allUsers',authorizeUser([roles.admin]),userController.getAllUsers)
userRouter.delete('/delete',authorizeUser([roles.admin,roles.user]),userController.deleteUser)
userRouter.post('/admin/createUser',authorizeUser([roles.admin]),validation(validators.createUser),userController.createUser)
userRouter.delete('/admin/user/:userId', authorizeUser([roles.admin]),validation(validators.getUserById), userController.deleteUserById);
userRouter.put('/admin/user/password/:userId', authorizeUser([roles.admin]),userController.updateUserPassword);
userRouter.get('/admin/user/:userId',authorizeUser([roles.admin]),validation(validators.getUserById),userController.getUserById);
userRouter.put('/admin/updateUser/:userId',authorizeUser([roles.admin]),userController.updateUserByAdmin)
userRouter.get('/admin/users/search/name/:username',authorizeUser([roles.admin]),userController.searchUserByName)
userRouter.get('/admin/users/search/email/:email',authorizeUser([roles.admin]),userController.searchUserByEmail)
userRouter.post('/signOut',authorizeUser([roles.admin,roles.user]),userController.signOut)



export default userRouter; 
