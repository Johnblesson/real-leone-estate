import Apartments from '../models/apartments.js';
import User from '../models/auth.js';

// Controller function to create a new apartment
const createApartment = async (req, res) => {
  try {
    // Check if req.file exists and has a value
    if (!req.file) {
      // Handle the case where no file was uploaded
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const durationSlashes = '/' + req.body.duration;

    // Create a new Apartments object with form data
    const apartmentData = new Apartments({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      duration: durationSlashes,  
      typeOfProperty: req.body.typeOfProperty,
      status: req.body.status,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      description: req.body.description,
      apartmentsPhoto: req.file.path,
      phone: req.body.phone,
      area: req.body.area,
      address: req.body.address,
      address2: req.body.address2,
      negotiation: req.body.negotiation,
      availabilty: req.body.availabilty,
      verification: req.body.verification,
      createdBy: req.body.createdBy,
      createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
      updatedAt: new Date()
    });

    const savedApartment = await apartmentData.save();
    res.status(201).render('success/apartment');
    console.log(savedApartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Controller function to get all apartments
const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartments.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a single apartment by ID
const getApartmentById = async (req, res) => {
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
const updateApartmentById = async (req, res) => {
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
const deleteApartmentById = async (req, res) => {
  try {
    const deletedApartment = await Apartments.findByIdAndDelete(req.params.id);
    if (!deletedApartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }
    res.status(200).json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const apartmentDisplay = async (req, res) => {
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
    // Fetch only verified apartments from the database
    const apartment = await Apartments.find({ verification: 'verified' });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated and get their ID
    const user = req.isAuthenticated() ? req.user : null;

    let relativePath = ''; // Declare relativePath outside the if block

    // Transform the photo path to match the URL served by Express
    if (user && user.photo) {
      const photoPath = user.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
    }

    // Render the all-properties view template with the verified apartments data
    res.render("all-properties", {
      apartment,
      greeting,
      user,
      relativePath,
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

    res.render("update-admin-apartment", {
      locals,
      apartment,
      greeting,
      user,
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

// Update Admin Apartments record
export const updateApartments = async (req, res) => {
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

    res.render("update-admin-apartment", {
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

    // Render the all-properties view template with the apartments data
    res.render("verify-apartment", {
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



export {
  createApartment,
  getAllApartments,
  getApartmentById,
  updateApartmentById,
  deleteApartmentById,
  apartmentDisplay,
};
