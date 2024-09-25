import jwt from 'jsonwebtoken';
import userModel from '../db/schemas/userSchema.js';

const validateToken = (token, authbearertoken) => {
  if (!token.startsWith(authbearertoken)) {
    throw new Error("Invalid bearer token");
  }
};

const getUserFromToken = async (token, AUTHTOKEN, authbearertoken) => {
  const extractedToken = token.split(authbearertoken)[1];
  const decoded = jwt.verify(extractedToken, AUTHTOKEN);
  return decoded.id;
};


const checkUserRole = (user, accessRole) => {
  if (!accessRole.includes(user.role)) {
    throw new Error("Not authorized");
  }
};

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
      res.status(500).json({ message: "catch error" });
    }
  };
};
