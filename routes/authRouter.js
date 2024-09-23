import { Router } from "express";
import * as AuthController from '../controllers/authController.js';
import { validation } from "../middleware/requestValidation.js";
import * as validators from './../validation/authValidation.js'
const router = Router();

router.post('/signUp', validation(validators.signup),AuthController.signUp); 
router.get('/confirmEmail/:token', AuthController.confirmEmail);
router.post('/signIn',validation(validators.signin),AuthController.signIn)
router.patch('/sendCode',validation(validators.sendCode),AuthController.sendCode)
router.patch('/forgetPassword',validation(validators.forgetpassword),AuthController.forgetPassword)
export default router; 
