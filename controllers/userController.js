import userModel from '../db/schemas/userSchema.js'; 
import bcrypt from 'bcrypt';

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

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await userModel.find({ role: 'user' });
      res.json({ message: 'Success', users });
    } catch (error) {
      next(Object.assign(new Error("server error"), { cause: 500 }));
    }
  };

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
export const signOut = async (req, res) => {
    try {

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during sign out:", error);
      res.status(500).json({ message: "Server error during sign out" });
    }
  };
    
  
  
  
  