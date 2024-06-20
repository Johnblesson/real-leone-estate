import express from 'express';
import mongoose from 'mongoose';
const app = express();
import User from '../models/auth.js';
import { body, validationResult } from 'express-validator';
// import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from '../passport/passport-config.js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

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

       // Check if req.file exists and has a value
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log req.file to ensure it contains the file information
    // console.log('Uploaded file:', req.file);

    // Check if req.file.location contains the S3 URL
    if (!req.file.location) {
      return res.status(400).json({ error: 'File location not found' });
    }

    // Log req.file.location to ensure it contains the S3 URL
    // console.log('File location:', req.file.location);

      // Create a new User object with form data
      const userData = new User({
          fullname: req.body.fullname,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          bio: req.body.bio,
          password: hashedPassword,
          // photo: req.file ? req.file.path : '', // Store the file path if file exists
          photo:  req.file.location, // Use S3 URL
          role: req.body.role,
          status: req.body.status,
          sudo: req.body.sudo,
          accountant: req.body.accountant,
          // termsConditions: req.body.termsConditions,
          // serviceFee: req.body.serviceFee,
          // privacyPolicy: req.body.privacyPolicy,
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
      res.redirect('/login'); // Redirect to homepage after successful signup
      // res.status(201).json({ message: 'Signed up successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while signing up.');
  }
};


// Google Oauth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/'
});

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
// export const getLoginPage = (req, res) => {
//   const ip =
//     req.headers['cf-conneting-ip'] ||
//     req.headers['x-real-ip'] ||
//     req.headers['x-forwarded-for'] ||
//     req.socket.remoteAddress || '';

//   const timestamp = new Date().toISOString();
//   console.log('ip address:', ip, '/', timestamp);
//   // res.render('login');
//   res.render('login', {
//   });
// 

// Get Login Page Controller
const GEOLOCATION_API_URL = process.env.GEOLOCATION_API_URL;
const API_KEY = process.env.API_KEY;

// Function to check if the IP address is private
const isPrivateIP = (ip) => {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./
  ];
  return privateRanges.some((range) => range.test(ip));
};

export const getLoginPage = async (req, res) => {
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  const timestamp = new Date().toISOString();
  console.log('IP address:', ip, '/', timestamp);

  try {
    if (ip && !isPrivateIP(ip)) {
      const response = await axios.get(`${GEOLOCATION_API_URL}/${ip}?access_key=${API_KEY}`);
      const locationData = response.data;
      console.log('Location Data:', locationData);
    } else {
      console.log('Skipping geolocation for private IP address:', ip);
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }

  res.render('login', {});
};



// Get All Users Controller
export const getAllUsers = async (req, res) => {

  const locals = {
    title: "All Users",
    description: "This is the all users page.",
  };

   // Function to determine the time of the day
const getTimeOfDay = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

  try {
   // Determine the time of the day
   const greeting = getTimeOfDay();

    const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await User.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    const user = req.isAuthenticated() ? req.user : null;

    // Fetch all users from the database
    // const users = await User.find({}, '-password'); // Exclude password field from the response
    const users = await User.aggregate([
      // Stage 1: Exclude password field from the response
      { $project: { password: 0 } },
      // Stage 2: Skip and limit
      { $skip: skip },
      { $limit: limit }
  ]);
  
    res.render('all-users', { 
      data: users, 
      locals,
      user,
      greeting,
      currentPage: page, 
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching users.');
  }
};


// Get
export const edituser = async (req, res) => {
  const locals = {
    title: "Edit user",
    description: "This is the edit user page.",
  };

  // Function to determine the time of the day
  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  try {
    const users = await User.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    const user = req.isAuthenticated() ? req.user : null;

    res.render("edit-user", {
      locals,
      users,
      greeting,
      user,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error.message);
    res.status(404).send("User not found");
  }
};

// Update user data #Sudo Admin
export const updateUser = async (req, res) => {
  try {
    // Extract the User ID from the request parameters
    const { id } = req.params;

    // Find the User record by ID and update its fields
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    // Check if the User record exists
    if (!updatedUser) {
      return res.status(404).json({ message: 'User record not found' });
    }

    // Respond with the updated User record
    // res.status(200).json(updatedStorage);
    res.render('success/users');
  } catch (error) {
    console.error('Error updating User record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user data
export const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.render("success/delete-user");
  } catch (error) {
    console.log(error);
  }
};


// View Edit password GET REQUEST Admin
export const viewChangePwdPage = async (req, res) => {

// Function to determine the time of the day
const getTimeOfDay = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};
  try {
    const users = await User.findOne({ _id: req.params.id });

    // Check if the user exists
    if (!users) {
      return res.status(404).send('User not found');
  }

  // Access the role from the retrieved user data
  const role = users.role;

  const user = req.isAuthenticated() ? req.user : null;

  // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
  const sudo = user && user.sudo ? user.sudo : false;

  // Determine the time of the day
  const greeting = getTimeOfDay();

    // res.render("update-password", {
    //   users,
    //   user,
    //   greeting,
    // });

    // Check the role and render the appropriate page
    if (role === 'admin') {
      // Render the admin update password page
      res.render('update-password', {
          users, // Pass user data to the template if needed
          greeting, // Greeting message for admin
          user,
          sudo
      });
  } else if (role === 'user') {
      // Render the user update password page
      res.render('update-password-user', {
          users, // Pass user data to the template if needed
          greeting, // Greeting message for user
          user,
      });
  } else {
      // Handle other roles or unauthorized access
      res.status(403).send('Unauthorized');
  }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
};

// Change Password Controller
export const changePassword = async (req, res) => {
  try {
    const { userId, username, email, oldPassword, newPassword } = req.body;

    let user;

    // Check if userId is provided
    if (userId) {
      // Find the user by userId
      user = await User.findById(userId);
    } else {
      // If userId is not provided, check by username or email
      user = await User.findOne({ $or: [{ username }, { email }] });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old password matches the user's current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    // Validate the new password format
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long and contain both uppercase and lowercase letters.',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // res.status(200).json({ message: 'Password changed successfully' });
    res.render('success/password');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while changing password.');
  }
};



// Get sudo only Page Controller 404
export const getSudoOnly = (req, res) => {
  const ip =
    req.headers['cf-conneting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  const timestamp = new Date().toISOString();
  console.log('ip address:', ip, 'attempt accessing the sudo-only route', timestamp);
  res.render('404-sudo', {
  });
};

// Get sudo only Page Controller
export const getAdminOnly = (req, res) => {
  const ip =
    req.headers['cf-conneting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  const timestamp = new Date().toISOString();
  console.log('ip address:', ip, 'attempt accessing the admin-only route', timestamp);
  res.render('404-admin', {
  });
};

// Go back function
export const goBack = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'admin') {
      res.redirect('/admin-home');
    } else {
      res.redirect('/home');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while going back.');
  }
};

