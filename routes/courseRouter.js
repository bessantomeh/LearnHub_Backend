import { roles } from '../services/role.js';
import * as CourseController from '../controllers/courseController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";

const courseRouter = Router()

courseRouter.post('/enroll',authorizeUser([roles.user]), CourseController.enrollInCourse)
courseRouter.get('/search/subject/:subject',authorizeUser([roles.user, roles.admin]), CourseController.searchCourseBySubject)
courseRouter.get('/search/title/:title',authorizeUser([roles.user, roles.admin]), CourseController.searchCourseByTitle)
courseRouter.get('/courses/user/:userId',authorizeUser([roles.user]), CourseController.listUserCourses)

export default courseRouter;