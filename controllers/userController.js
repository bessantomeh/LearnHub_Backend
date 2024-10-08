import userModel from '../db/schemas/userSchema.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SendEmail from '../services/email.js';

/*
  Controller for managing user-related operations including 
  profile retrieval, password updates, user management, and more.
 */


// Function to help the user get their profile
export const getProfile = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const user = await userModel.findById(req.user._id).select('-password -sendCode -__v');;
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: "Success", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'server error' });
    }
  };

// Function for the user to update their password
export const updatePassword = async (req, res) => {
    try {
      if (!process.env.SALTROUNT) {
        throw new Error('SALTROUNDS environment variable is not defined.');
      }
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const { oldPassword, newPassword } = req.body;
  
      const user = await userModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the old password with the current password
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        return res.status(409).json({ message: "Old password is invalid" });
      }
  
      const hash = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNT));
  
      const updateUser = await userModel.findByIdAndUpdate(req.user._id, { password: hash });
  
      if (!updateUser) {
        return res.status(500).json({ message: "Failed to update password" });
      }
  
      res.status(200).json({ message: "Password updated successfully" });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Function for the user to update their details
export const updateUser = async (req, res) => {
    try {
      const id = req.user?._id; 
      const updates = req.body; 
  
      const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'server error' });
    }
  };

// Function to retrieve all users with the role 'user'
export const getAllUsers = async (req, res, next) => {
    try {
      const users = await userModel.find({ role: 'user' });
      res.json({ message: 'Success', users });
    } catch (error) {
      next(Object.assign(new Error("server error"), { cause: 500 }));
    }
  };

// Function for the user to delete their account
export const deleteUser = async (req, res) => {
    try {
      const userId = req.user._id; 
  
      const user = await userModel.findByIdAndDelete(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

// Function to retrieve a user by their ID
export const getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the user details' });
    }
  };

  // Function to search users by their username
  export const searchUserByName = async (req, res) => {
    const { username } = req.params;  
    
    try {
      const users = await userModel.find({ username: { $regex: new RegExp(username, 'i') } });
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'No Users found with the given namw.' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error searching users by name.', error });
    }
  };

  // Function to search users by their email
  export const searchUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const users = await userModel.find({ email: { $regex: new RegExp(email, 'i') } });
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found with the given email.' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error searching users by email.', error });
    }
  };

// Function to sign out the user
export const signOut = async (req, res) => {
    try {
        
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during sign out:", error);
      res.status(500).json({ message: "Server error during sign out" });
    }
  };


  // Function to update the password of a user by admin
  export const updateUserPassword = async (req, res) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;
      const user = await userModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      } else {
        if (!process.env.SALTROUNT || !process.env.EMAILTOKEN) {
          throw new Error('SALTROUNT | EMAILTOKEN environment variable is not defined.');
        }
        const SALTROUNT = parseInt(process.env.SALTROUNT);
        const hash = bcrypt.hashSync(password, SALTROUNT);
        const updateUser = await userModel.findByIdAndUpdate(userId, { password: hash });
        
        if (!updateUser) {
          return res.status(500).json({ message: "Failed to update password" });
        } else {
          return res.status(200).json({ message: "Password updated successfully" });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  // Function to delete a user by their ID (admin functionality)
  export const deleteUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.findByIdAndDelete(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ message: 'Success, User deleted', user });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  // Function to update user details by admin
  export const updateUserByAdmin = async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;
      const updatedUser = await userModel.findByIdAndUpdate(userId, { username, email });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
  

  // Function to create a new user
  export const createUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      if (!process.env.SALTROUNT || !process.env.EMAILTOKEN) {
        throw new Error('SALTROUNDS or EMAILTOKEN environment variable is not defined.');
      }
       const existingUser = await userModel.findOne({ email }).select("email");
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      const saltRounds = parseInt(process.env.SALTROUNT);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new userModel({ username, email, password: hashedPassword, confirmEmail: true });
  
      const token = jwt.sign({ id: newUser._id }, process.env.EMAILTOKEN, { expiresIn: '1h' });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
