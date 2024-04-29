import User from '../models/auth.js';
import Apartments from '../models/apartments.js';
// import { body, validationResult } from 'express-validator';

export const profile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
      if (users && users.photo) {
        const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
      }
  
      const locals = {
        title: "Users Profile",
        description: "This is the users profile page.",
      };
  
      res.render("profile", {
        locals,
        users, // Pass the transformed users data to the EJS template
        relativePath, // Pass the transformed photo path to the EJS template
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while fetching users profile.");
    }
  };
  
  export const adminprofile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
      if (users && users.photo) {
        const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
      }
  
      const locals = {
        title: "Users Profile",
        description: "This is the users profile page.",
      };
  
      res.render("profile-admin", {
        locals,
        users, // Pass the transformed users data to the EJS template
        relativePath, // Pass the transformed photo path to the EJS template
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while fetching users profile.");
    }
  };
  
  // View user's profile GET REQUEST
  export const updateprofile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
      if (users && users.photo) {
        const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
      }
  
      const locals = {
        title: "User Profile",
        description: "This is the user profile page.",
      };
  
      res.render("update-profile", {
        locals,
        users,
        relativePath, 
      });
    } catch (error) {
      console.log(error);
    }
  };

   // View user's profile GET REQUEST
   export const updateadminprofile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
      if (users && users.photo) {
        const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
      }
  
      const locals = {
        title: "User Profile",
        description: "This is the user profile page.",
      };
  
      res.render("update-admin-profile", {
        locals,
        users,
        relativePath, 
      });
    } catch (error) {
      console.log(error);
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
      res.render('success/profile', { users: updatedUser }); // Pass the updated user data to the template
    } catch (error) {
      console.error('Error updating User record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
   
  // Get all users
  export const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
