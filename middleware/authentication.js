import jwt from 'jsonwebtoken';
import userModel from '../db/schemas/userSchema.js';

// Validate that the token starts with 'Bearer '
const validateToken = (token, authbearertoken) => {
  if (!token.startsWith(authbearertoken)) {
    throw new Error("Invalid bearer token");
  }
};

// Extract user ID from the token
const getUserFromToken = async (token, AUTHTOKEN, authbearertoken) => {
  const extractedToken = token.split(' ')[1]; // Split and take the second part (actual token)
  const decoded = jwt.verify(extractedToken, AUTHTOKEN); // Verify the token
  return decoded.id; // Return the user ID
};

// Check if the user has the required role
const checkUserRole = (user, accessRole) => {
  if (!accessRole.includes(user.role)) {
    throw new Error("Not authorized");
  }
};

// Middleware to authorize user based on roles
export const authorizeUser = (accessRole = []) => {
  return async (req, res, next) => {
    try {
      const { authbearertoken, AUTHTOKEN } = process.env;

      // Check if required environment variables are defined
      if (!authbearertoken || !AUTHTOKEN) {
        throw new Error('Required environment variables are not defined.');
      }

      const token = req.headers.token; 
      validateToken(token, authbearertoken); 
      const userId = await getUserFromToken(token, AUTHTOKEN, authbearertoken); 
      const user = await userModel.findById(userId).select('role'); 

      if (!user) {
        throw new Error("Not a registered user");
      }

      checkUserRole(user, accessRole); // Check user roles

      req.user = user; 
      next(); 
    } catch (error) {
      console.error('JWT Verification Error:', error); 
      res.status(401).json({ message: "Unauthorized" }); 
    }
  };
};
