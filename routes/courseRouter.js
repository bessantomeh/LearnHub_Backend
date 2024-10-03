import { roles } from '../services/role.js';
import * as CourseController from '../controllers/courseController.js'; 
import {authorizeUser} from "../middleware/authentication.js";
import { Router } from "express";


const courseRouter = Router();
courseRouter.post('/createCourse', authorizeUser([roles.admin]), CourseController.createCourse);
courseRouter.patch('/courses/:courseId', authorizeUser([roles.admin]), CourseController.updateCourse);
courseRouter.delete('/deleteCourses/:courseId', authorizeUser([roles.admin]), CourseController.deleteCourse);
courseRouter.get('/coursesDetails/:courseId', CourseController.getCourseDetails);
courseRouter.get('/Courses', CourseController.getAllCourses);
courseRouter.get('/search/subject/:subject',CourseController.searchCourseBySubject);
courseRouter.get('/search/title/:title',CourseController.searchCourseByTitle);
courseRouter.get('/search/instructor/:instructor',CourseController.searchCourseByInstructor);
courseRouter.get('/search/startdate/:startdate',CourseController.searchCourseByStartDate);
courseRouter.get('/NewCourses', CourseController.getNewCourses);
export default courseRouter; 
