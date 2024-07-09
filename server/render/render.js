import Apartments from "../models/apartments.js";
import User from "../models/auth.js";
import moment from "moment";
import mongoose from 'mongoose';

export const homeRoute = async (req, res) => {
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
     // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
     const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    const greeting = getTimeOfDay();
    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated

     // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

      // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    res.render("index", {
      apartments,
      greeting,
      user,
      apts,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};

// Admin Home Route
export const adminHomeRoute = async (req, res) => {
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
    // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    const greeting = getTimeOfDay();
    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

      // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const sudo = user && user.sudo ? user.sudo : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const accountant = user && user.accountant ? user.accountant : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    res.render("index-admin", {
      apartments,
      greeting,
      user,
      role,
      apts,
      sudo,
      accountant,
      manager,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};



  // Post Apartment
export const getPostApartment = async (req, res) => {
 
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
    const role = user ? user.role : null; // Get user role if user is authenticated

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('post-apartment', { user, greeting, role });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};


// Post Apartment Admin
export const getPostApartmentAdmin = async (req, res) => {

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
    const role = user ? user.role : null; // Get user role if user is authenticated


     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const sudo = user && user.sudo ? user.sudo : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const accountant = user && user.accountant ? user.accountant : false;

    // Render the index page with the receptions and latestStorage data
    res.render('post-apartment-admin', { user, greeting, sudo, accountant, role });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Display all properties for admin
export const allAdminProperties = async (req, res) => {
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
     // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });
    const greeting = getTimeOfDay();
    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
    // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

    // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
      const sudo = user && user.sudo ? user.sudo : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const accountant = user && user.accountant ? user.accountant : false;

    res.render("all-admin-properties", {
      apartments,
      greeting,
      user,
      apts,
      sudo,
      accountant,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
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
      const apts = await Apartments.findOne({ _id: req.params.id });
      // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
      const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });
      const user = req.isAuthenticated() ? req.user : null;
      const role = user ? user.role : null; // Get user role if user is authenticated

      const apartment = await Apartments.find();

    // Ensure photoUrl is set properly for each apartment
    apartments.forEach(apartment => {
      if (!apartment.photo) {
        apartment.photoUrl = ''; // Initialize an empty string if no photo is available
      } else {
        apartment.photoUrl = apartment.photo; // Set photoUrl to the value of photo
      }
    });

    const locals = {
      title: "All Properties",
      description: "This is the all properties page.",
    };
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('all-properties', { locals, apartment, greeting, user, apartments, role });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

    // About Page
export const about = async (req, res) => {
    const locals = {
      title: "About Page",
      description: "This is the about page of the System.",
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
    // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly to the first photo if it's an array
      if (Array.isArray(apartment.photo) && apartment.photo.length > 0) {
        apartment.photoUrl = apartment.photo[0];
      } else {
        apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available
      }
    });
      const user = req.isAuthenticated() ? req.user : null;
      const role = user ? user.role : null; // Get user role if user is authenticated

  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('about', { locals, user, greeting, apartments,role });
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
      const role = user ? user.role : null; // Get user role if user is authenticated
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('features', { locals, user, greeting, role });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

// Blog Page
export const blog = async (req, res) => {
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
    // Fetch all verified apartments from the database
    const apartments = await Apartments.find({ verification: 'verified' });

    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available
    });

    const greeting = getTimeOfDay();

    res.render("index-admin", { // Assuming your main admin page is index-admin.ejs
      apartments,
      greeting,
      user,
      role
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
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
      const role = user ? user.role : null; // Get user role if user is authenticated
  
       // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Render the index page with the receptions and latestStorage data
      res.render('service', { locals, user, greeting, role });
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

        // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
        const sudo = user && user.sudo ? user.sudo : false;

        // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
        const accountant = user && user.accountant ? user.accountant : false;

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
      sudo,
      accountant,
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
    const role = user ? user.role : null; // Get user role if user is authenticated

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('all-users', { locals, user, greeting, role });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller function to render guest page
export const guestPage = async (req, res) => {
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
    res.render('guest-page', { greeting, apts, user, apartments });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to display a single apartment's details
export const apartmentDetail = async (req, res) => {
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
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid apartment ID");
    }

    const apartment = await Apartments.findById(id);

    if (!apartment) {
      return res.status(404).send("Apartment not found");
    }

    // Ensure photoUrls is set properly for the current apartment
    const updatedApartment = {
      ...apartment._doc,
      photoUrls: [apartment.photo, apartment.photo1, apartment.photo2].filter(Boolean) // Filter out undefined or empty strings
    };

    // Fetch all apartments for other sections or navigation
    const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated
    const greeting = getTimeOfDay();

    // Format the createdAt date and calculate days ago
    updatedApartment.formattedCreatedAt = moment(updatedApartment.createdAt).format('DD-MM-YYYY HH:mm');
    updatedApartment.daysAgo = moment().diff(moment(updatedApartment.createdAt), 'days');

    res.render("apartment-detail", {
      apartment: updatedApartment,
      apartments, // Ensure apartments are passed to the template
      user,
      role,
      greeting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the apartment details.");
  }
};

// Controller to display a single apartment's details
export const adminApartmentDetail = async (req, res) => {
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
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid apartment ID");
  }

  const apartment = await Apartments.findById(id);

  if (!apartment) {
    return res.status(404).send("Apartment not found");
  }

  // Ensure photoUrls is set properly for the current apartment
  const updatedApartment = {
    ...apartment._doc,
    photoUrls: [apartment.photo, apartment.photo1, apartment.photo2].filter(Boolean) // Filter out undefined or empty strings
  };

  // Fetch all apartments for other sections or navigation
  const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

  const user = req.isAuthenticated() ? req.user : null;
  const role = user ? user.role : null; // Get user role if user is authenticated
  const greeting = getTimeOfDay();

  // Format the createdAt date and calculate days ago
  updatedApartment.formattedCreatedAt = moment(updatedApartment.createdAt).format('DD-MM-YYYY HH:mm');
  updatedApartment.daysAgo = moment().diff(moment(updatedApartment.createdAt), 'days');


  // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
  const sudo = user && user.sudo ? user.sudo : false;

  // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
  const accountant = user && user.accountant ? user.accountant : false;

  res.render("apartment-detail-admin", {
    apartment: updatedApartment,
    apartments, // Ensure apartments are passed to the template
    user,
    greeting,
    role,
    sudo,
    accountant,
  });
} catch (error) {
  console.error(error);
  res.status(500).send("An error occurred while fetching the apartment details.");
}
};


export const faq = async (req, res) => {
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
    // const apts = await Apartments.findOne({ _id: req.params.id });
    //  // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    //  const apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    const greeting = getTimeOfDay();
    const user = req.isAuthenticated() ? req.user : null;
    const role = user ? user.role : null; // Get user role if user is authenticated

    //  // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    // apartments.forEach(apartment => {
    //   // Ensure photoUrl is set properly
    //   apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

    //   // Format the createdAt date and calculate days ago
    //   apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
    //   apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    // });

    res.render("faq", {
      // apartments,
      greeting,
      user,
      // apts,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};