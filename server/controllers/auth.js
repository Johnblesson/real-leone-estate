import express from 'express';
const app = express();
import User from '../models/auth.js';
import { body, validationResult } from 'express-validator';
// import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from '../passport/passport-config.js';
// import dotenv from 'dotenv';

//  // Sign Up Controller
//  export const signUp = async (req, res) => {
//     // Validation checks
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     req.session = req.session || {};

//     // Create a session
//     req.session.user = {
//     // Other user information
//         isSignUp: true,
//         isLogin: true,
//     };
  
//     try {
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  
//       const userData = new User({
//         fullname: req.body.fullname,
//         username: req.body.username,
//         email: req.body.email,
//         bio: req.body.bio,
//         password: hashedPassword,
//         photo: req.body.photo,
//         role: req.body.role,
//         status: req.body.status,
//         sudo: req.body.sudo,
//         createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
//         updatedAt: new Date()
//       });
  
//       // Check for duplicate usernames
//       const existingUser = await User.findOne({ username: userData.username });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Username is already taken' });
//       }
  
//       // Ensure the password contains at least one uppercase letter, one lowercase letter, and is at least 6 characters long
//       if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(req.body.password)) {
//         return res.status(400).json({
//           error: 'Password must be at least 6 characters long and contain both uppercase and lowercase letters.',
//         });
//       }
  
//       const savesData = await userData.save();
//       res.redirect('/');
//       console.log(savesData);
//       // res.status(201).json({ message: 'Signed up successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('An error occurred while signing up.');
//     }
//   };

// Sign Up Controller
export const signUp = async (req, res) => {
  // Validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  req.session = req.session || {};

  // Create a session
  req.session.user = {
      // Other user information
      isSignUp: true,
      isLogin: true,
  };

  try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Create a new User object with form data
      const userData = new User({
          fullname: req.body.fullname,
          username: req.body.username,
          email: req.body.email,
          bio: req.body.bio,
          password: hashedPassword,
          photo: req.file ? req.file.path : '', // Store the file path if file exists
          role: req.body.role,
          status: req.body.status,
          sudo: req.body.sudo,
          createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
          updatedAt: new Date()
      });

      // Check for duplicate usernames
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
          return res.status(400).json({ error: 'Username is already taken' });
      }

      // Ensure the password contains at least one uppercase letter, one lowercase letter, and is at least 6 characters long
      if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(req.body.password)) {
          return res.status(400).json({
              error: 'Password must be at least 6 characters long and contain both uppercase and lowercase letters.',
          });
      }

      // Save user data to the database
      const savedData = await userData.save();
      console.log(savedData);
      res.redirect('/'); // Redirect to homepage after successful signup
      // res.status(201).json({ message: 'Signed up successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while signing up.');
  }
};

  // Login Controller
export const logIn = (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).json({ msg: info.message });
      }

      // Check if user status is active
      if (user.status === 'active') {
        // User is active, proceed with login
        req.login(user, async (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }

          // Create a JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24hrs' });
          delete user.password;
          req.session.user = user;
          console.log(token);
          res.cookie('token', token, { httpOnly: true });

          // Check the role and render different views
          if (user.role === 'admin') {
            res.redirect('/admin-home');
          } else if (user.role === 'user') {
            res.redirect('/home');
          } else {
            res.redirect('/home');
          }
        });
      } else {
        // User status is inactive, send forbidden response
        res.status(403).json({ msg: 'Forbidden: User status is inactive.' });
      }
    } catch (catchErr) {
      res.status(500).json({ error: catchErr.message });
    }
  })(req, res, next);
};


// Get Login Page Controller
export const getLoginPage = (req, res) => {
  const ip =
    req.headers['cf-conneting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  const timestamp = new Date().toISOString();
  console.log('ip address:', ip, '/', timestamp);
  res.render('login');
};


// // View user's profile GET REQUEST
// export const profile = async (req, res) => {
//   try {
//     const users = await User.findOne({ _id: req.params.id });
//     const locals = {
//       title: "User Profile",
//       description: "This is the user profile page.",
//     };

//     res.render("profile", {
//       locals,
//       users,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
