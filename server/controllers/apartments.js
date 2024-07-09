import Apartments from '../models/apartments.js';
import User from '../models/auth.js';
import moment from 'moment';
import mongoose from 'mongoose';

// Controller function to create a new apartment
export const createApartment = async (req, res) => {
  try {
    // Check if all three required files are uploaded
    if (!req.files || !req.files.photo || !req.files.photo[0] || !req.files.photo1 || !req.files.photo1[0] || !req.files.photo2 || !req.files.photo2[0]) {
      return res.status(400).json({ error: 'All three photos are required' });
    }

    // Log req.files to ensure it contains the file information
    console.log('Uploaded files:', req.files);

    const photo = req.files.photo[0];
    const photo1 = req.files.photo1[0];
    const photo2 = req.files.photo2[0];

    // Check if files contain the location
    if (!photo.location || !photo1.location || !photo2.location) {
      return res.status(400).json({ error: 'File locations not found' });
    }

    // Log file locations to ensure they contain the S3 URLs
    console.log('File locations:', photo.location, photo1.location, photo2.location);

    // Find the user by username or email (assuming req.body.createdBy is the username or email)
    // const user = await User.findOne({ username: req.body.createdBy });
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    const userId = req.user._id; // Assuming you have user info in req.user from authentication middleware

    const user = await User.find();

    const durationSlashes = req.body.duration;

    // Create a new Apartments object with form data
    const apartmentData = new Apartments({
      aid: req.body.aid,
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      duration: durationSlashes, 
      currency: req.body.currency, 
      typeOfProperty: req.body.typeOfProperty,
      status: req.body.status,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      description: req.body.description,
      photo: photo.location, // Use S3 URL
      photo1: photo1.location, // Use S3 URL
      photo2: photo2.location, // Use S3 URL
      phone: req.body.phone,
      area: req.body.area,
      address: req.body.address,
      address2: req.body.address2,
      negotiation: req.body.negotiation,
      availabilty: req.body.availabilty,
      verification: req.body.verification,
      sponsored: req.body.sponsored,
      createdBy: req.body.createdBy,
      user: userId,
      createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
      updatedAt: new Date()
    });

    const savedApartment = await apartmentData.save();

    if (user.role === 'admin') {
      res.redirect('/admin-apartment-success');
    } else if (user.role === 'user') {
      res.redirect('/apartment-success');
    } else {
      res.redirect('/apartment-success');
    }
    console.log(savedApartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Controller function to get all apartments
export const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartments.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a single apartment by ID
export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartments.findById(req.params.id);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }
    res.status(200).json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to update an apartment by ID
export const updateApartmentById = async (req, res) => {
  try {
    const updatedApartment = await Apartments.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedApartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }
    res.status(200).json(updatedApartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to delete an apartment by ID
// export const deleteApartmentById = async (req, res) => {
//   try {
//     const deletedApartment = await Apartments.findByIdAndDelete(req.params.id);
//     if (!deletedApartment) {
//       res.status(404).json({ message: 'Apartment not found' });
//       return;
//     }
//     res.status(200).json({ message: 'Apartment deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const deleteApartmentById = async (req, res) => {
//   try {
//     await Apartments.deleteOne({ _id: req.params.id });
//     res.render("success/delete-apartment");
//   } catch (error) {
//     console.log(error);
//   }
// };

export const deleteApartmentById = async (req, res) => {
  const apartmentId = req.params.id;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
    return res.status(400).send({ error: 'Invalid apartment ID' });
  }

  try {
    const result = await Apartments.deleteOne({ _id: apartmentId });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Apartment not found' });
    }
    res.render("success/delete-apartment");
  } catch (error) {
    console.error('Error deleting apartment:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


// Controller to display all properties for users
export const apartmentDisplay = async (req, res) => {
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

    // Render the all-properties view template with the apartments data
    res.render("all-properties", {
      apartments,
      greeting,
      user,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};


// Controller function to get all apartments
export const allApartments = async (req, res) => {
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
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    const users = await User.find();
    // Fetch all apartments from the database
    const apartments = await Apartments.find();

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    // Render the all-properties view template with the apartments data
    res.render("all-apartments", {
      apartments,
      greeting,
      user,
      users,
      currentPage: page, 
      totalPages: totalPages,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};

// Controller function to get sponsorsip
export const sponsorship = async (req, res) => {
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
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    const users = await User.find();
    // Fetch all apartments from the database
    const apartments = await Apartments.find();

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    // Render the all-properties view template with the apartments data
    res.render("sponsorship", {
      apartments,
      greeting,
      user,
      users,
      currentPage: page, 
      totalPages: totalPages,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};


// Controller function to get availabilty
export const availabilty = async (req, res) => {
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
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    const users = await User.find();
    // Fetch all apartments from the database
    const apartments = await Apartments.find();

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    // Render the all-properties view template with the apartments data
    res.render("availability", {
      apartments,
      greeting,
      user,
      users,
      currentPage: page, 
      totalPages: totalPages,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};


//Get all apartments on a list
export const getListedApartments = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    const allApartments = await Apartments.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    // Fetch the most recent storage data
    const latestApartment = await Apartments.findOne().sort({ _id: -1 });

   res.render('admin-dashboard', { 
    allApartments, 
    latestApartment, 
    currentPage: page, 
    totalPages: totalPages,
})
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

// Get
export const editapartment = async (req, res) => {

  const locals = {
    title: "Edit Apartment",
    description: "This is the edit apartment page.",
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

     // Determine the time of the day
     const greeting = getTimeOfDay();

     const user = req.isAuthenticated() ? req.user : null;

    res.render("update-apartment", {
      locals,
      apartment,
      greeting,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get
export const admineditapartment = async (req, res) => {

  const locals = {
    title: "Edit Apartment",
    description: "This is the edit apartment page.",
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

     // Determine the time of the day
     const greeting = getTimeOfDay();

     const user = req.isAuthenticated() ? req.user : null;

         // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
         const sudo = user && user.sudo ? user.sudo : false;

         // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
         const manager = user && user.manager ? user.manager : false;
     
         const accountant = user && user.accountant ? user.accountant : false;

    res.render("update-admin-apartment", {
      locals,
      apartment,
      greeting,
      user,
      manager,
      sudo,
      accountant,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update Admin Apartments record
export const updateAdminApartments = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID of the record to be updated

    // Find the existing Apartments record by ID and update its fields
    const updatedApartment = await Apartments.findByIdAndUpdate(id, req.body, { new: true });

    // Check if the Apartments record exists
    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartments record not found' });
    }

    // Respond with the updated Apartments record
    res.status(200).render('success/update-apartment', { updatedApartment });
  } catch (error) {
    console.error('Error updating Apartments record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get all apartments
export const properties = async (req, res) => {
  try {
    // Fetch all apartments from the database
    const apartments = await Apartments.find();

    // Render the all-properties view template with the apartments data
    res.render("properties", {
      apartments, // Pass the apartments data to the EJS template
      relativePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};

// Get
export const adminEditApartments = async (req, res) => {
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    const user = req.isAuthenticated() ? req.user : null;

    const accountant = user && user.accountant ? user.accountant : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    res.render("update-admin-apartment", {
      locals,
      apartment,
      greeting,
      user,
      manager,
      accountant,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error.message);
    res.status(404).send("User not found");
  }
};


// Controller function to get all apartments
export const adminVerifyApartment = async (req, res) => {
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
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await Apartments.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    const users = await User.find();
    // Fetch all apartments from the database
    const apartments = await Apartments.find();

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    // Render the all-properties view template with the apartments data
    res.render("verify-apartment", {
      apartments,
      greeting,
      user,
      manager,
      users,
      currentPage: page, 
      totalPages: totalPages,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};

// Get
export const verifyUpdateApartment = async (req, res) => {
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    const user = req.isAuthenticated() ? req.user : null;

    res.render("verification", {
      locals,
      apartment,
      greeting,
      user,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error.message);
    res.status(404).send("User not found");
  }
};


// View get
export const viewapartment = async (req, res) => {
  try {
     const apartment = await Apartments.findOne({ _id: req.params.id });

    if (!apartment) {
      return res.status(404).send("Apartment not found");
    }
  
    // Ensure photoUrls is set properly for the current apartment
    const updatedApartment = {
      ...apartment._doc,
      photoUrls: [apartment.photo, apartment.photo1, apartment.photo2].filter(Boolean) // Filter out undefined or empty strings
    };

      // Format the createdAt date and calculate days ago
      updatedApartment.formattedCreatedAt = moment(updatedApartment.createdAt).format('DD-MM-YYYY HH:mm');
      updatedApartment.daysAgo = moment().diff(moment(updatedApartment.createdAt), 'days');


    res.render("view-apt", {
      apartment,
      apartment: updatedApartment,
    });
  } catch (error) {
    console.log(error);
  }
};

// Search bar
export const search = async (req, res) => {
  try {
    const search = await Apartments.distinct('location');

    res.render("all-admin-properties", {
      search
    });
  } catch (error) {
    console.log(error);
  }
};



// Get Upadate Sponsorship
export const editSponsorship = async (req, res) => {

  const locals = {
    title: "Edit Apartment",
    description: "This is the edit apartment page.",
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

     // Determine the time of the day
     const greeting = getTimeOfDay();

     const user = req.isAuthenticated() ? req.user : null;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const sudo = user && user.sudo ? user.sudo : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    const accountant = user && user.accountant ? user.accountant : false;

    res.render("sponsorship-form", {
      locals,
      apartment,
      greeting,
      user,
      sudo, 
      accountant,
      manager
    });
  } catch (error) {
    console.log(error);
  }
};


// Update Admin Apartments record
export const updateAdminSponsorship = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID of the record to be updated

    // Find the existing Apartments record by ID and update its fields
    const updatedApartment = await Apartments.findByIdAndUpdate(id, req.body, { new: true });

    // Check if the Apartments record exists
    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartments record not found' });
    }

    // Respond with the updated Apartments record
    res.status(200).render('success/update-apartment', { updatedApartment });
  } catch (error) {
    console.error('Error updating Apartments record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Admin Apartments record
export const updateAdminAvaliability = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID of the record to be updated

    // Find the existing Apartments record by ID and update its fields
    const updatedApartment = await Apartments.findByIdAndUpdate(id, req.body, { new: true });

    // Check if the Apartments record exists
    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartments record not found' });
    }

    // Respond with the updated Apartments record
    res.status(200).render('success/update-apartment', { updatedApartment });
  } catch (error) {
    console.error('Error updating Apartments record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Upadate Avaliabilty
export const editAvaliabilty = async (req, res) => {

  const locals = {
    title: "Edit Apartment",
    description: "This is the edit apartment page.",
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
    const apartment = await Apartments.findOne({ _id: req.params.id });

     // Determine the time of the day
     const greeting = getTimeOfDay();

     const user = req.isAuthenticated() ? req.user : null;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const sudo = user && user.sudo ? user.sudo : false;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    const accountant = user && user.accountant ? user.accountant : false;

    res.render("avaliability-form", {
      locals,
      apartment,
      greeting,
      user,
      sudo,
      accountant,
      manager
    });
  } catch (error) {
    console.log(error);
  }
};


// Controller to display the search apartment page
export const searchApartment = async (req, res) => {
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
    // Get the search query from the request
    const { location } = req.query;

    // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    let apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    // Filter apartments by location if a location is specified
    if (location) {
      apartments = apartments.filter(apartment => apartment.location === location);
    }

    // Get unique locations for the dropdown
    const locations = [...new Set(apartments.map(apartment => apartment.location))];

    const greeting = getTimeOfDay();
    const user = req.isAuthenticated() ? req.user : null;

    const role = user ? user.role : null; // Get user role if user is authenticated

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const manager = user && user.manager ? user.manager : false;

    // Process each apartment to set photoUrl, formattedCreatedAt, and daysAgo
    apartments.forEach(apartment => {
      // Ensure photoUrl is set properly
      apartment.photoUrl = apartment.photo || ''; // Use empty string if no photo is available

      // Format the createdAt date and calculate days ago
      apartment.formattedCreatedAt = moment(apartment.createdAt).format('DD-MM-YYYY HH:mm');
      apartment.daysAgo = moment().diff(moment(apartment.createdAt), 'days');
    });

    // Render the search view template with the apartments and locations data
    res.render("search", {
      apartments,
      locations,
      greeting,
      user,
      role,
      manager,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};


// Controller to display the search apartment admin page
export const searchApartmentAdmin = async (req, res) => {
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
    // Get the search query from the request
    const { location } = req.query;

    // Find all verified apartments and sort them by sponsored status and createdAt timestamp in descending order
    let apartments = await Apartments.find({ verification: 'verified' }).sort({ sponsored: -1, createdAt: -1 });

    // Filter apartments by location if a location is specified
    if (location) {
      apartments = apartments.filter(apartment => apartment.location === location);
    }

    // Get unique locations for the dropdown
    const locations = [...new Set(apartments.map(apartment => apartment.location))];

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

    const manager = user && user.manager ? user.manager : false;

    // Render the search view template with the apartments and locations data
    res.render("search-admin", {
      apartments,
      locations,
      greeting,
      user,
      sudo,
      role,
      accountant,
      manager,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching apartments.");
  }
};


// detail