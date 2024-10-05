import { signIn } from '../controllers/authController.js'; 
import userModel from '../db/schemas/userSchema.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../db/schemas/userSchema.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('signIn function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'testpassword'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.AUTHTOKEN = 'testauthtoken';
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); 
  });

  afterAll(() => {
    console.log.mockRestore(); 
  });

  it('should return 404 when user is not found', async () => {
    userModel.findOne.mockResolvedValue(null);

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User is not registered." });
  });

  it('should return 403 when email is not confirmed', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedpassword', confirmEmail: false };
    userModel.findOne.mockResolvedValue(mockUser);

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Email is not confirmed." });
  });

  it('should return 401 when password is incorrect', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedpassword', confirmEmail: true };
    userModel.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid password." });
  });

  it('should return 200 and token when sign in is successful', async () => {
    const mockUser = { _id: 'userid', email: 'test@example.com', password: 'hashedpassword', confirmEmail: true, role: 'user' };
    userModel.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    const mockToken = 'testtoken';
    jwt.sign.mockReturnValue(mockToken);

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Success", token: mockToken, role: 'user' });
  });

  it('should handle server errors', async () => {
    userModel.findOne.mockRejectedValue(new Error('Database error'));

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error." });
  });
});