import Apartments from '../models/apartments.js';
import User from '../models/auth.js';

// Controller function to create a new apartment
export const createApartment = async (req, res) => {
  try {
    // Check if req.file exists and has a value
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log req.file to ensure it contains the file information
    console.log('Uploaded file:', req.file);

    // Check if req.file.location contains the S3 URL
    if (!req.file.location) {
      return res.status(400).json({ error: 'File location not found' });
    }

    // Log req.file.location to ensure it contains the S3 URL
    console.log('File location:', req.file.location);

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
      photo: req.file.location, // Use S3 URL
      phone: req.body.phone,
      area: req.body.area,
      address: req.body.address,
      address2: req.body.address2,
      negotiation: req.body.negotiation,
      availabilty: req.body.availabilty,
      verification: req.body.verification,
      sponsored: req.body.sponsored,
      createdBy: req.body.createdBy,
      createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
      updatedAt: new Date()
    });

    const savedApartment = await apartmentData.save();

    if (user.role === 'admin') {
      res.redirect('/admin-apartment-success')
    } else if (user.role === 'user') {
      res.redirect('/apartment-success')
    } else {
      res.redirect('/apartment-success')
    }
    // res.status(201).render('success/apartment');
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
export const deleteApartmentById = async (req, res) => {
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

    // Ensure photoUrl is set properly for each apartment
    apartments.forEach(apartment => {
      if (!apartment.photo) {
        apartment.photoUrl = ''; // Initialize an empty string if no photo is available
      } else {
        apartment.photoUrl = apartment.photo; // Set photoUrl to the value of photo
      }
    });

    res.render("all-properties", {
      apartments,
      greeting,
      user,
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


// View get
export const viewapartment = async (req, res) => {
  try {
    const apartment = await Apartments.findOne({ _id: req.params.id });

    res.render("view-apt", {
      apartment,
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

    res.render("sponsorship-form", {
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

