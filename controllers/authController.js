import userModel from '../db/schemas/userSchema.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SendEmail from '../services/email.js';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';

/*
  Controller for handling user authentication-related operations,
  including sign-up, email confirmation, sign-in, password recovery, 
  and verification of recovery codes.
 */


// Function to handle user sign-up 
const userCache = new Map();  
const usedTokens = new Set();  

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userInputEmail = email.trim().toLowerCase();

    if (userCache.has(userInputEmail)) {
      return res.status(409).json({ message: 'Email already exists (cached)' });
    }

    const user = await userModel.findOne({ email: userInputEmail }).select("email");
    if (user) {
      userCache.set(userInputEmail, user);
      return res.status(409).json({ message: 'Email already exists' });
    }

    if (!process.env.SALTROUNT || !process.env.AUTHTOKEN) {
      throw new Error('SALTROUNT or AUTHTOKEN environment variable is not defined.');
    }

    const SALTROUNT = parseInt(process.env.SALTROUNT);
    const hash = bcrypt.hashSync(password, SALTROUNT);  

    const newUser = new userModel({ username, email: userInputEmail, password: hash });

    let token = jwt.sign({ id: newUser._id }, process.env.AUTHTOKEN, { expiresIn: "1d" });
    while (usedTokens.has(token)) {
      token = jwt.sign({ id: newUser._id }, process.env.AUTHTOKEN, { expiresIn: "1d" });
    }
    usedTokens.add(token);  

    const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}auth/confirmEmail/${token}`;
    const message = `<a href="${link}">Confirm Email</a>`;

    const info = await SendEmail(userInputEmail, 'Verify email', message);
    if (info.accepted.length) {
      const savedUser = await newUser.save();
      userCache.set(userInputEmail, savedUser);
      return res.status(201).json({ message: 'Success', token });
    } else {
      return next(Object.assign(new Error("Email rejected"), { cause: 404 }));
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to confirm a user's email address
export const confirmEmail = async (req, res, next) => {
    try {
      if (!process.env.AUTHTOKEN) {
        throw new Error('AUTHTOKEN environment variable is not defined.');
      }
      if (!process.env.FEURL) {
        throw new Error('FEURL variable is not defined.');
      }
  
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.AUTHTOKEN);
  
      if (!decoded) {
        const error = new Error("Invalid token payload");
        error.cause = 400;
        return next(error);
      } else {
        const user = await userModel.findOneAndUpdate(
          { _id: decoded.id, confirmEmail: false },
          { confirmEmail: true }
        );
  
        if (!user) {
          const error = new Error("Account already confirmed");
          error.cause = 400;
          return next(error);
        } else {
            const FEURL = process.env.FEURL;
            const redirectURL = new URL('HomePage', FEURL).href; 
            res.status(200).redirect(redirectURL);
        }
      }
    } catch (error) {
      console.log(error);
      const serverError = new Error("Server error");
      serverError.cause = 500;
      next(serverError);
    }
  };


// Function to handle user sign-in
export const signIn = async (req, res, next) => {
    try {
      if (!process.env.AUTHTOKEN) {
        throw new Error('AUTHTOKEN environment variable is not defined.');
      }
  
      const { email, password } = req.body;
      const sanitizedEmail = email.toString();
      const user = await userModel.findOne({ email:sanitizedEmail });
  
      if (!user) {
        return res.status(404).json({ message: "User is not registered." });
      } 
      
      if (!user.confirmEmail) {
        return res.status(403).json({ message: "Email is not confirmed." });
      }
  
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return res.status(401).json({ message: "Invalid password." });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.AUTHTOKEN, { expiresIn: "1d" });
      res.status(200).json({ message: "Success", token, role: user.role });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error." });
    }
  };

// Function to send a verification code for when password is forgotten
export const sendCode = async (req, res, next) => {
    const { email } = req.body;
  const sanitizedEmail = email.toString();
    const user = await userModel.findOne({ email:sanitizedEmail}).select('email');
    if (!user) {
      res.json({ message: "invalid account" });
    } else {
      const code = uuidv4();
      SendEmail(email, 'Forget password', `verify code :${code}`);
      const updateUser = await userModel.updateOne({ _id: user._id }, { sendCode: code });
      if (!updateUser) {
        res.json({ message: "invalid" });
      } else {
        res.json({ message: "success" });
      }
    }
  };

// Function to handle password recovery
export const forgetPassword = async (req, res, next) => {
    const { code, email, newPassword } = req.body;
    if (!process.env.SALTROUNT) {
      throw new Error('SALTROUNT | EMAILTOKEN environment variable is not defined.');
    }
    if (code == null) {
      res.json({ message: "fail" });
    } else {
      const hash = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNT));
      const user = await userModel.findOneAndUpdate({ email:email.toString(), sendCode: code.toString() }, { password: hash, sendCode: null });
      if (!user) {
        res.json({ message: "fail" });
      } else {
        res.json({ message: "success" });
      }
    }
  };

// Function to verify the recovery code
export const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
       const sanitizedEmail = email.toString();
      const user = await userModel.findOne({email:sanitizedEmail}).select("sendCode");
    
       if (!user?.sendCode) {
    return res.status(404).json({ message: "Invalid email or no code sent" });
}
        if (user.sendCode !== code) {
            return res.status(401).json({ message: "Invalid code" });
        }


        return res.status(200).json({ message: "Code verified successfully" });

    } catch (error) {
        console.error("Error verifying code:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
  
