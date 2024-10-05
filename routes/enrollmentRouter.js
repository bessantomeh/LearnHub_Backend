import { roles } from '../services/role.js';
import * as EnrollmentController from '../controllers/EnrollmentController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";


const enrollRouter = Router()

enrollRouter.post('/enroll',authorizeUser([roles.user]), EnrollmentController.enrollInCourse)
enrollRouter.get('/courses/user',authorizeUser([roles.user]), EnrollmentController.listUserCourses)
enrollRouter.post('/unenroll',authorizeUser([roles.user]), EnrollmentController.unenrollFromCourse)


export default enrollRouter;