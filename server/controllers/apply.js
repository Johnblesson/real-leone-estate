import Apartments from "../models/apartments.js";
import Application from "../models/apply.js";

// Controller function to create a new application
export const createApplication = async (req, res) => {
  try {
    // Extracting data from request body
    const { phone, location, applyAid, username, address, address2, createdBy, comments } = req.body;

    // Create a new Application object with form data
    const applicationForm = new Application({
      phone,
      location,
      username,
      applyAid,
      address,
      address2,
      createdBy,
      comments,
      createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
      updatedAt: new Date()
    });

    // Saving the application to the database
    const savedApplication = await applicationForm.save();

    // Sending a success response
    res.status(201).render('success/application')
    console.log(savedApplication);
  } catch (error) {
    // Sending an error response
    res.status(400).json({ error: error.message });
  }
};


// Get All Users Controller
export const getAllApplication = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
    const limit = 15; // Number of entries per page
    const skip = (page - 1) * limit;

    // Fetch all storage data
    // const allStorage = await User.find().skip(skip).limit(limit);
    const totalEntries = await Application.countDocuments();

    const totalPages = Math.ceil(totalEntries / limit);

    // Fetch all users from the database
    // const users = await User.find({}, '-password'); // Exclude password field from the response
    const apply = await Application.aggregate([
      // Stage 1: Exclude password field from the response
      { $project: { password: 0 } },
      // Stage 2: Skip and limit
      { $skip: skip },
      { $limit: limit }
  ]);
  
    res.render('all-application', { 
      apply: apply, 
      currentPage: page, 
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching users.');
  }
};

// Get
export const editApplication = async (req, res) => {
  const locals = {
    title: "Edit application",
    description: "This is the edit application page.",
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
    const apply = await Application.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    const user = req.isAuthenticated() ? req.user : null;

    res.render("edit-application", {
      locals,
      apply,
      greeting,
      user,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error.message);
    res.status(404).send("User not found");
  }
};

// Delete application data
export const deleteApplication = async (req, res) => {
  try {
    await Application.deleteOne({ _id: req.params.id });
    res.render("success/delete-application");
  } catch (error) {
    console.log(error);
  }
};


// Get application by ID
export const application = async (req, res) => {

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
    // Get the apartment ID and location from the query parameters
    const apartmentId = req.query.aid;
    const location = req.query.location;

    // Fetch the apartment details based on the ID
    const apartment = await Apartments.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated
    const user = req.isAuthenticated() ? req.user : null;

    // Render the apply page with the necessary data
    res.render('apply', {
      user,
      greeting,
      apartment,
      aid: apartmentId,
      location: location,
    });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Admin Application
export const adminApplication = async (req, res) => {

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
    // Get the apartment ID and location from the query parameters
    const apartmentId = req.query.aid;
    const location = req.query.location;

    // Fetch the apartment details based on the ID
    const apartment = await Apartments.findOne({ _id: req.params.id });

    // Determine the time of the day
    const greeting = getTimeOfDay();

    // Check if the user is authenticated
    const user = req.isAuthenticated() ? req.user : null;

    // Render the apply page with the necessary data
    res.render('apply-admin', {
      user,
      greeting,
      apartment,
      aid: apartmentId,
      location: location,
    });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};


// Update Admin Applications record
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID of the record to be updated

    // Find the existing Applications record by ID and update its fields
    const updatedApplication = await Application.findByIdAndUpdate(id, req.body, { new: true });

    // Check if the Applications record exists
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application record not found' });
    }

    // Respond with the updated Applications record
    res.status(200).render('success/update-application', { updatedApplication });
  } catch (error) {
    console.error('Error updating Applications record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};