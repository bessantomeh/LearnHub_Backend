import Course from '../db/schemas/courseSchema.js';
import Enrollment from '../db/schemas/EnrollmentSchema.js';
import userModel from '../db/schemas/userSchema.js';

export const enrollInCourse = async (req, res) => {
    const { userId, courseId } = req.body; 
  
    try {
      if (!userId || !courseId) {
        return res.status(400).json({ message: 'User ID and Course ID are required.' });
      }
  
      const user = await userModel.findById(userId);
      const course = await Course.findById(courseId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }
  
      const existingEnrollment = await Enrollment.findOne({ userId, courseId });
  
      if (existingEnrollment) {
        return res.status(400).json({ message: 'User is already enrolled in this course.' });
      }
  
      const enrolledCount = await Enrollment.countDocuments({ courseId });
      if (enrolledCount >= course.capacity) {
        return res.status(400).json({ message: 'Course capacity has been reached.' });
      }
  
      const newEnrollment = new Enrollment({
        userId,
        courseId,
      });
  
      const savedEnrollment = await newEnrollment.save();
  
      course.capacity -= 1; 
      await course.save(); 
  
      res.status(201).json(savedEnrollment);
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling in the course.', error });
    }
  };
  

export const searchCourseByTitle = async (req, res) => {
  const { title } = req.query; 

  try {
    const courses = await Course.find({ title: new RegExp(title, 'i') }); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error searching courses by title.', error });
  }
};

export const searchCourseBySubject = async (req, res) => {
  const { subject } = req.query; 

  try {
    const courses = await Course.find({ subject: new RegExp(subject, 'i') }); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error searching courses by subject.', error });
  }
};

export const listUserCourses = async (req, res) => {
  const { userId } = req.params; 

  try {
    const enrollments = await Enrollment.find({ userId }).populate('courseId');
    if (enrollments.length === 0) {
      return res.status(404).json({ message: 'No courses found for this user.' });
    }

    const courses = enrollments.map(enrollment => enrollment.courseId);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user courses.', error });
  }
};

