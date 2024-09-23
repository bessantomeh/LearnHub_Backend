import { Router } from "express";
import * as AuthController from '../controllers/authController.js';
import { validation } from "../middleware/requestValidation.js";
import * as validators from './../validation/authValidation.js'
const router = Router();

router.post('/signUp', validation(validators.signup),AuthController.signUp); 
router.get('/confirmEmail/:token', AuthController.confirmEmail);
export default router; 
