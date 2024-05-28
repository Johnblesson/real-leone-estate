import Apartments from "../models/apartments.js";
import User from "../models/auth.js";
import moment from "moment";


// Admin
 // About Page
export const adminAbout = async (req, res) => {
    const locals = {
      title: "Home Page",
      description: "This is the home page of the System.",
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
      const user = req.isAuthenticated() ? req.user : null;
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('admin-about', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

    // Features Page
export const adminFeatures = async (req, res) => {
    const locals = {
      title: "Home Page",
      description: "This is the home page of the System.",
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
      const user = req.isAuthenticated() ? req.user : null;
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('admin-features', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

// Controller function to render guest page
export const adminBlog = async (req, res) => {
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
    const apts = await Apartments.findOne({ _id: req.params.id });
    const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    const user = req.isAuthenticated() ? req.user : null;

     // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
     apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

      // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    const greeting = getTimeOfDay();
    res.render('admin-blog', { greeting, apts, user, apartments, apT });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// service Page
export const adminService = async (req, res) => {
    const locals = {
      title: "Home Page",
      description: "This is the home page of the System.",
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
      const user = req.isAuthenticated() ? req.user : null;
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('admin-service', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };


// Terms and Conditions
export const termsConditions = async (req, res) => {

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

    const user = req.isAuthenticated() ? req.user : null;

    res.render("terms-conditions", {
      greeting,
      user,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error.message);
    res.status(404).send("Page not found");
  }
};

// registration process statement
export const registrationProcessStatement = (req, res) => {
  res.render("registration-process-statement")
}