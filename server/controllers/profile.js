import User from '../models/auth.js';
import moment from 'moment';
import Apartments from '../models/apartments.js';

export const profile = async (req, res) => {
  try {
    // Fetch a single user by ID
    const users = await User.findOne({ _id: req.params.id });

    // Ensure photoUrl is set properly for the user
    if (!users.photo) {
      users.photoUrl = ''; // Initialize an empty string if no photo is available
    } else {
      users.photoUrl = users.photo; // Set photoUrl to the value of photo
    }

    const user = req.isAuthenticated() ? req.user : null;

    const locals = {
      title: "User Profile",
      description: "This is the user's profile page.",
    };

    // Render the profile page with the user data
    res.render("profile", {
      locals,
      users, // Pass the user data to the EJS template
      user, // Pass the authenticated user data to the EJS template
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching the user's profile.");
  }
};



  export const adminprofile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
  
     // Ensure photoUrl is set properly for each user
     users.forEach(user => {
      if (!user.photo) {
        user.photoUrl = ''; // Initialize an empty string if no photo is available
      } else {
        user.photoUrl = user.photo; // Set photoUrl to the value of photo
      }
    });

    const user = req.isAuthenticated() ? req.user : null;
  
      res.render("profile-admin", {
        users, // Pass the transformed users data to the EJS template
        locals,
        user, // Pass the authenticated user data to the EJS template
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while fetching users profile.");
    }
  };

  
  // // View user's profile GET REQUEST
  // export const updateprofile = async (req, res) => {
  //   try {
  //     const users = await User.findOne({ _id: req.params.id });
      
  //     // Ensure photoUrl is set properly for each user
  //    users.forEach(user => {
  //     if (!user.photo) {
  //       user.photoUrl = ''; // Initialize an empty string if no photo is available
  //     } else {
  //       user.photoUrl = user.photo; // Set photoUrl to the value of photo
  //     }
  //   });
  
  //     const locals = {
  //       title: "User Profile",
  //       description: "This is the user profile page.",
  //     };
  
  //     res.render("update-profile", {
  //       locals,
  //       users, // Pass the transformed users data to the EJS template
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

   // View user's profile GET REQUEST
   export const updateadminprofile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
      let relativePath = ''; // Declare relativePath outside the if block
  
     // Ensure photoUrl is set properly for each user
     users.forEach(user => {
      if (!user.photo) {
        user.photoUrl = ''; // Initialize an empty string if no photo is available
      } else {
        user.photoUrl = user.photo; // Set photoUrl to the value of photo
      }
    });
  
      const locals = {
        title: "User Profile",
        description: "This is the user profile page.",
      };
  
      res.render("update-admin-profile", {
        locals,
        users, 
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


  // View user GET REQUEST
export const view = async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.params.id });

    let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
      if (users && users.photo) {
        const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
      }

          // Get the authenticated user from the request object
    const user = req.isAuthenticated() ? req.user : null;

    // Redirect to login if user is not authenticated
    if (!user) {
      return res.redirect('/login'); // Redirect to login if user is not authenticated
    }

    // Get the user ID from the authenticated user
    const userId = user._id;

    // Find all verified apartments created by the authenticated user
    const apartments = await Apartments.find({ user: userId, verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });
    const role = user.role;

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

      // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    res.render("view", {
      users,
      relativePath,
      user,
      role,
      apartments,
    });
  } catch (error) {
    console.log(error);
  }
};

  // View admin GET REQUEST
  export const viewAdminProfile = async (req, res) => {
    try {
      const users = await User.findOne({ _id: req.params.id });
  
      let relativePath = ''; // Declare relativePath outside the if block
    
        // Transform the photo path to match the URL served by Express
        if (users && users.photo) {
          const photoPath = users.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
          relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
        }
  
            // Get the authenticated user from the request object
      const user = req.isAuthenticated() ? req.user : null;
  
      // Redirect to login if user is not authenticated
      if (!user) {
        return res.redirect('/login'); // Redirect to login if user is not authenticated
      }
  
      // Get the user ID from the authenticated user
      const userId = user._id;
  
      // Find all verified apartments created by the authenticated user
      const apartments = await Apartments.find({ user: userId, verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });
      const role = user.role;
  
      // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
      apartments.forEach(apartment => {
        // Ensure photoUrl is set properly
        apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available
  
        // Format the createdAt date and calculate days ago
        apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
        apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
      });
  
      res.render("view1", {
        users,
        relativePath,
        user,
        role,
        apartments,
      });
    } catch (error) {
      console.log(error);
    }
  };


 // Get user's profile page
  export const getUpdateProfile = async (req, res) => {
 
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
      const user = req.isAuthenticated() ? req.user : null;
      const role = user ? user.role : null; // Get user role if user is authenticated
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('update-profile', { user, greeting, role, users });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };


  // Get admin profile update page
  export const adminUpdateProfile = async (req, res) => {
 
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
      const user = req.isAuthenticated() ? req.user : null;
      const role = user ? user.role : null; // Get user role if user is authenticated
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('update-profile-admin', { user, greeting, role, users });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };
