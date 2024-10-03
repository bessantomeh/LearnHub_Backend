import Course from '../db/schemas/courseSchema.js';
import Enrollment from '../db/schemas/EnrollmentSchema.js';



export const createCourse = async (req, res) => {
  try {
    const { title, description, instructors, startDate, endDate, capacity, subject } = req.body;
    
    if (!title || !description || !instructors || !startDate || !endDate || !capacity || !subject) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    if (capacity <= 0) {
      return res.status(400).json({ error: 'Capacity must be a positive number' });
    }

    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course with this title already exists' });
    }

    const newCourse = new Course({
      title,
      description,
      instructors, 
      startDate,
      endDate,
      capacity,
      subject,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: savedCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create the course' });
  }
};

export const updateCourse = async (req, res) => {
    try {
      const courseId = req.params.courseId; 
      const { title, description, instructors, startDate, endDate, capacity, subject } = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          title,
          description,
          instructors,  
          startDate,
          endDate,
          capacity,
          subject,
        },
        { new: true, runValidators: true } 
      );
  
      res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: 'Failed to update the course' });
    }
  };

export const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      await Enrollment.deleteMany({ courseId });
      await Course.findByIdAndDelete(courseId);
      await Enrollment.deleteMany({ courseId });
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the course' });
    }
  };

export const getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the course details' });
    }
  };

export const getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find();
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No courses found' });
      }
  
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve courses' });
    }
  };


  export const searchCourseByTitle = async (req, res) => {
    const { title } = req.params;
    
    try {
      const decodedTitle = decodeURIComponent(title);
      const escapedTitle = decodedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
      const courses = await Course.find({ title: { $regex: new RegExp(escapedTitle, 'i') } });
  
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No courses found with the given title.' });
      }
  
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error searching courses by title.', error });
    }
  };
  
  export const searchCourseBySubject = async (req, res) => {
    const { subject } = req.params;
    
    try {
      const decodedSubject = decodeURIComponent(subject);  
      const escapedSubject = decodedSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
      const courses = await Course.find({ subject: { $regex: new RegExp(escapedSubject, 'i') } });
  
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No courses found with the given subject.' });
      }
  
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error searching courses by subject.', error });
    }
  };
  
  
  export const getNewCourses = async (req,res) => {

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const newCourses = await Course.find({
        startDate: { $gte: thirtyDaysAgo }
      }).sort({ startDate: -1 }); 
  
      if (!newCourses.length) {
        return res.status(404).json({ message: 'No new courses available.' });
      }
  
      res.status(200).json(newCourses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching new courses.', error });
    }};


    export const searchCourseByInstructor = async (req, res) => {
      const { instructor } = req.params;
    
      try {
        const decodedInstructor = decodeURIComponent(instructor);
        const escapedInstructor = decodedInstructor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const courses = await Course.find({ instructors: { $regex: new RegExp(escapedInstructor, 'i') } });
    
        if (courses.length === 0) {
          return res.status(404).json({ message: 'No courses found for the given instructor.' });
        }
    
        res.status(200).json(courses);
      } catch (error) {
        res.status(500).json({ message: 'Error searching courses by instructor.', error });
      }
    };

    export const searchCourseByStartDate = async (req, res) => {
      const { startDate } = req.params;
    
      try {
        // make sure the startDate is in a valid format (YYYY-MM-DD)
        const parsedDate = new Date(startDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ message: 'Invalid start date format.' });
        }
        const courses = await Course.find({ startDate: { $gte: parsedDate } });
    
        if (courses.length === 0) {
          return res.status(404).json({ message: 'No courses found starting on or after the given date.' });
        }
    
        res.status(200).json(courses);
      } catch (error) {
        res.status(500).json({ message: 'Error searching courses by start date.', error });
      }
    };
    
    
  
  
