import jwt from 'jsonwebtoken';
import userModel from '../db/schemas/userSchema.js';


// Function to validate the provided token
const validateToken = (token, authbearertoken) => {
  if (!token.startsWith(authbearertoken)) {
    throw new Error("Invalid bearer token");
  }
};

// Function to extract and verify the user from the token
const getUserFromToken = async (token, AUTHTOKEN, authbearertoken) => {
  const extractedToken = token.split(authbearertoken)[1]; 
  const decoded = jwt.verify(extractedToken, AUTHTOKEN); 
  return decoded.id; 
};

// Function to check if the user's role is allowed access
const checkUserRole = (user, accessRole) => {
  if (!accessRole.includes(user.role)) {
    throw new Error("Not authorized");
  }
};


// Middleware function to authorize the user based on their role
export const authorizeUser = (accessRole = []) => {
  return async (req, res, next) => {
    try {
      const { authbearertoken, AUTHTOKEN } = process.env;

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

      checkUserRole(user, accessRole); 

      req.user = user; 
      next(); 
    } catch (error) {
      console.error('JWT Verification Error:', error); 
      res.status(401).json({ message: "Unauthorized" }); 
    }
  };
};
