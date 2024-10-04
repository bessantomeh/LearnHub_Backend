// enrollmentController.test.js

import { enrollInCourse } from '../controllers/EnrollmentController.js';
import userModel from '../db/schemas/userSchema.js';
import Course from '../db/schemas/courseSchema.js';
import Enrollment from '../db/schemas/EnrollmentSchema.js';

jest.mock('../db/schemas/userSchema.js');
jest.mock('../db/schemas/courseSchema.js');
jest.mock('../db/schemas/EnrollmentSchema.js');

describe('enrollInCourse', () => {
  let req, res, mockFindById, mockFindOne, mockSave;

  beforeEach(() => {
    req = { body: { courseId: 'courseId' }, user: { _id: 'userId' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockFindById = jest.fn();
    mockFindOne = jest.fn();
    mockSave = jest.fn();

    userModel.findById = mockFindById;
    Course.findById = mockFindById;
    Enrollment.findOne = mockFindOne;
  });

  it('returns 400 if userId or courseId is missing', async () => {
    req.body.courseId = null;
    await enrollInCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User ID and Course ID are required.' });
  });

  it('returns 404 if user is not found', async () => {
    mockFindById.mockResolvedValueOnce(null);
    await enrollInCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
  });

  it('returns 404 if course is not found', async () => {
    mockFindById
      .mockResolvedValueOnce({ _id: 'userId' })
      .mockResolvedValueOnce(null);
    await enrollInCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course not found.' });
  });

  it('returns 400 if user is already enrolled in course', async () => {
    mockFindById.mockResolvedValueOnce({ _id: 'userId' });
    mockFindById.mockResolvedValueOnce({ _id: 'courseId' });
    mockFindOne.mockResolvedValueOnce({ userId: 'userId', courseId: 'courseId' });
    await enrollInCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User is already enrolled in this course.' });
  });

  it('returns 400 if course capacity is reached', async () => {
    mockFindById.mockResolvedValueOnce({ _id: 'userId' });
    mockFindById.mockResolvedValueOnce({ _id: 'courseId', capacity: 1 });
    Enrollment.countDocuments = jest.fn().mockResolvedValueOnce(1);
    mockFindOne.mockResolvedValueOnce(null);
    await enrollInCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course capacity has been reached.' });
  });

  it('enrolls user successfully and decreases capacity', async () => {
    const course = { capacity: 10, save: jest.fn().mockResolvedValue() };
    mockFindById.mockResolvedValueOnce({ _id: 'userId' });
    mockFindById.mockResolvedValueOnce(course);
    mockFindOne.mockResolvedValueOnce(null);
    Enrollment.mockImplementation(() => ({ save: mockSave }));

    await enrollInCourse(req, res);

    expect(mockSave).toHaveBeenCalled();
  expect(course.capacity).toBe(9);
  expect(course.save).toHaveBeenCalled();
  
  expect(res.status).toHaveBeenCalledWith(201);

});
});
