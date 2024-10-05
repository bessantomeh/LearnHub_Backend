import { createCourse } from '../controllers/courseController.js';
import Course from '../db/schemas/courseSchema.js';  

jest.mock('../db/schemas/courseSchema.js');

describe('createCourse', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Course',
        description: 'Test Description',
        instructors: ['Instructor 1'],
        startDate: '2024-10-01',
        endDate: '2024-10-10',
        capacity: 10,
        subject: 'Test Subject'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a course successfully', async () => {
    Course.findOne.mockResolvedValue(null);
    Course.prototype.save = jest.fn().mockResolvedValue(req.body);

    await createCourse(req, res);

    expect(Course.findOne).toHaveBeenCalledWith({ title: req.body.title });
    expect(Course.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Course created successfully',
      course: req.body
    });
  });

  it('should return 400 if any required field is missing', async () => {
    req.body.title = '';

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all required fields' });
  });

  it('should return 400 if startDate is greater than or equal to endDate', async () => {
    req.body.startDate = '2024-10-10';
    req.body.endDate = '2024-10-01';

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Start date must be before end date' });
  });

  it('should return 400 if capacity is not a positive number', async () => {
    // Make all fields valid except capacity
    req.body = {
      title: 'Valid title',
      description: 'Valid description',
      instructors: ['Instructor 1'],
      startDate: '2024-10-01',
      endDate: '2024-10-10',
      capacity: -5,  // Invalid capacity
      subject: 'Valid subject'
    };

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Capacity must be a positive number' });
  });

  it('should return 400 if course with the same title already exists', async () => {
    Course.findOne.mockResolvedValue(req.body);

    await createCourse(req, res);

    expect(Course.findOne).toHaveBeenCalledWith({ title: req.body.title });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Course with this title already exists' });
  });

  it('should return 500 if there is a server error', async () => {
    Course.findOne.mockRejectedValue(new Error('Database error'));

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create the course' });
  });
});