import { roles } from '../services/role.js';
import * as CourseController from '../controllers/courseController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";


const enrollRouter = Router()

enrollRouter.post('/enroll',authorizeUser([roles.user]), CourseController.enrollInCourse)
enrollRouter.get('/courses/user/:userId',authorizeUser([roles.user]), CourseController.listUserCourses)


export default enrollRouter;