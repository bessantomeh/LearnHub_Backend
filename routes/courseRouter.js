import { roles } from '../services/role.js';
import * as CourseController from '../controllers/courseController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";


const courseRouter = Router();
courseRouter.post('/createCourse', authorizeUser([roles.admin]), CourseController.createCourse);
courseRouter.patch('/courses/:courseId', authorizeUser([roles.admin]), CourseController.updateCourse);
courseRouter.delete('/deleteCourses/:courseId', authorizeUser([roles.admin]), CourseController.deleteCourse);
courseRouter.get('/coursesDetails/:courseId', authorizeUser([roles.user, roles.admin]), CourseController.getCourseDetails);
courseRouter.get('/Courses', authorizeUser([roles.user, roles.admin]), CourseController.getAllCourses);

export default courseRouter; 
