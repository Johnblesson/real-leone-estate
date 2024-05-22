import Apartments from "../models/apartments.js";
import User from "../models/auth.js";

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

    apartments.forEach(apartment => {
      if (apartment.photo) {
        const photoPath = apartment.photo.replace(/\\/g, '/');
        apartment.relativePath = photoPath.replace('public/assets/', '/assets/');
      } else {
        apartment.relativePath = '';
      }
    });

    res.render("index", {
      apartments,
      greeting,
      user,
      apts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};

  // Admin Home Page
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
  
      apartments.forEach(apartment => {
        if (apartment.photo) {
          const photoPath = apartment.photo.replace(/\\/g, '/');
          apartment.relativePath = photoPath.replace('public/assets/', '/assets/');
        } else {
          apartment.relativePath = '';
        }
      });
  
      res.render("index-admin", {
        apartments,
        greeting,
        user,
        apts,
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

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('post-apartment', { user, greeting});
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

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('post-apartment-admin', { user, greeting});
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

    apartments.forEach(apartment => {
      if (apartment.photo) {
        const photoPath = apartment.photo.replace(/\\/g, '/');
        apartment.relativePath = photoPath.replace('public/assets/', '/assets/');
      } else {
        apartment.relativePath = '';
      }
    });

    res.render("all-admin-properties", {
      apartments,
      greeting,
      user,
      apts,
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

    // Transform photo paths for rendering
    apartments.forEach(apartment => {
      if (apartment.photo) {
        const photoPath = apartment.photo.replace(/\\/g, '/');
        apartment.relativePath = photoPath.replace('public/assets/', '/assets/');
      } else {
        apartment.relativePath = '';
      }
    });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    res.render("index-admin", { // Assuming your main admin page is index-admin.ejs
      apartments,
      greeting,
      user
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


// Guest Page
export const guestPage = async (req, res) => {
 
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

   apartments.forEach(apartment => {
     if (apartment.photo) {
       const photoPath = apartment.photo.replace(/\\/g, '/');
       apartment.relativePath = photoPath.replace('public/assets/', '/assets/');
     } else {
       apartment.relativePath = '';
     }
   });

     // Determine the time of the day
    const greeting = getTimeOfDay();

    // Render the index page with the receptions and latestStorage data
    res.render('guest-page', { greeting, apts, user, apartments });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};