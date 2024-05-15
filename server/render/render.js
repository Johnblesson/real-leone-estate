import Apartments from "../models/apartments.js";
import User from "../models/auth.js";

// User Home Page
export const homeRoute = async (req, res) => {
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
    const apartment = await Apartments.find();
    let relativePath = ''; // Declare relativePath outside the if block

    // Transform the photo path to match the URL served by Express
  if (apartment && apartment.apartmentsPhoto) {
    const photoPath = apartment.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
  }

    // Check if the user is authenticated and get their ID
    const userId = req.isAuthenticated() ? req.user._id : null;

    // Fetch user by ID from the database if user is authenticated
    const user = userId ? await User.findById(userId) : null;

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('index', { locals, user, greeting, apartment, relativePath});
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

  
  // Admin Home Page
  export const adminHomeRoute = async (req, res) => {
  
    const locals = {
        title: "Home Page",
        description: "This is the admin home page of the System.",
    };
  
      // Function to determine the time of the day
  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  
    try {
      const apartment = await Apartments.find();
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
    if (apartment && apartment.apartmentsPhoto) {
      const photoPath = apartment.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
    }

      const user = req.isAuthenticated() ? req.user : null;
  
      // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions data
      res.render('index-admin', {locals, user, greeting, apartment, relativePath});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };


  // service Page
export const getPostApartment = async (req, res) => {
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
    res.render('post-apartment', { locals, user, greeting});
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// All Properties Page
export const allAdminProperties = async (req, res) => {
    
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

    const apartment = await Apartments.find();
    let relativePath = ''; // Declare relativePath outside the if block

    // Transform the photo path to match the URL served by Express
  if (apartment && apartment.apartmentsPhoto) {
    const photoPath = apartment.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
  }

  const locals = {
    title: "All Properties",
    description: "This is the all properties page.",
  };

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('all-admin-properties', { locals, apartment, greeting, user, relativePath });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};
  
  // All Properties Page
export const allProperties = async (req, res) => {
    
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

      const apartment = await Apartments.find();
      let relativePath = ''; // Declare relativePath outside the if block

      // Transform the photo path to match the URL served by Express
    if (apartment && apartment.apartmentsPhoto) {
      const photoPath = apartment.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
    }

    const locals = {
      title: "All Properties",
      description: "This is the all properties page.",
    };
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('all-properties', { locals, apartment, greeting, user, relativePath });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

    // About Page
export const about = async (req, res) => {
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
      res.render('about', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

    // Features Page
export const features = async (req, res) => {
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
      res.render('features', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

 // Blog Page
export const blog = async (req, res) => {
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

      const apartment = await Apartments.find();
      let relativePath = ''; // Declare relativePath outside the if block
  
      // Transform the photo path to match the URL served by Express
    if (apartment && apartment.apartmentsPhoto) {
      const photoPath = apartment.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
    }
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('blog', { locals, user, greeting, apartment, relativePath });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

// service Page
export const service = async (req, res) => {
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
      res.render('service', { locals, user, greeting});
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  // Admin Listed Properties

  // service Page
export const listedProperties = async (req, res) => {
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
    const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
    const limit = 4; // Number of entries per page
    const skip = (page - 1) * limit;

      // Fetch all storage data
    // const allStorage = await RECEPTION.find();
    const allApartments = await Apartments.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);
    // const allStorage = await Apartments.find();

    // Fetch the most recent storage data
    const latestApartment = await Apartments.findOne().sort({ _id: -1 });

    const user = req.isAuthenticated() ? req.user : null;

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('admin-dashboard', 
    { 
      locals, 
      user, 
      greeting,
      allApartments, 
      latestApartment, 
      currentPage: page, 
      totalPages: totalPages,
    });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};


// User Page
export const allusers = async (req, res) => {
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
    res.render('all-users', { locals, user, greeting});
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

