import { roles } from '../services/role.js';
import * as EnrollmentController from '../controllers/EnrollmentController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";
import { validation } from './../middleware/requestValidation.js';
import * as validators from './../validation/courseValidation.js';

const enrollRouter = Router()

enrollRouter.post('/enroll',authorizeUser([roles.user]),validation(validators.enroll), EnrollmentController.enrollInCourse)
enrollRouter.get('/courses/user',authorizeUser([roles.user]), EnrollmentController.listUserCourses)
enrollRouter.post('/unenroll',authorizeUser([roles.user]),validation(validators.enroll), EnrollmentController.unenrollFromCourse)


export default enrollRouter;
