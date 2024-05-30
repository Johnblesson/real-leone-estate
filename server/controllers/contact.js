import Contacts from "../models/contact.js";

// Controller function to create a new Contacts
export const createContacts = async (req, res) => {
  try {
    // Extracting data from request body
    const { fullname, phone, location, username, createdBy, msg } = req.body;

    // Create a new Contacts object with form data
    const contactsForm = new Contacts({
    fullname,
    phone,
    location,
    username,
    createdBy,
    msg,
      createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
      updatedAt: new Date()
    });

    // Saving the Contacts to the database
    const savedContacts = await contactsForm.save();

    // Sending a success response
    res.status(201).render('success/contacts')
    console.log(savedContacts);
  } catch (error) {
    // Sending an error response
    res.status(400).json({ error: error.message });
  }
};


// Get All Users Controller
export const getAllContacts = async (req, res) => {

    try {
      const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
      const limit = 15; // Number of entries per page
      const skip = (page - 1) * limit;
  
      // Fetch all storage data
      // const allStorage = await User.find().skip(skip).limit(limit);
      const totalEntries = await Contacts.countDocuments();
  
      const totalPages = Math.ceil(totalEntries / limit);
  
      // Fetch all users from the database
      // const users = await User.find({}, '-password'); // Exclude password field from the response
      const contact = await Contacts.aggregate([
        // Stage 1: Exclude password field from the response
        { $project: { password: 0 } },
        // Stage 2: Skip and limit
        { $skip: skip },
        { $limit: limit }
    ]);
    
      res.render('all-contacts', { 
        contact: contact, 
        currentPage: page, 
        totalPages: totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching users.');
    }
  };


  // Get contact form
export const getContactForm = async (req, res) => {

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
  
      // Check if the user is authenticated
      const user = req.isAuthenticated() ? req.user : null;
  
      // Render the apply page with the necessary data
      res.render('contact', {
        user,
        greeting,
      });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

// Get admin contact form
export const getAdminContactForm = async (req, res) => {

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

    // Check if the user is authenticated
    const user = req.isAuthenticated() ? req.user : null;

    // Fetch user data from the session or request object (assuming req.user is set by the authentication middleware)
    const sudo = user && user.sudo ? user.sudo : false;

    // Render the apply page with the necessary data
    res.render('contact-admin', {
      user,
      greeting,
      sudo,
    });
  } catch (error) {
    console.error('Error rendering the page:', error);
    res.status(500).send('Internal Server Error');
  }
};

  export const messageView = async (req, res) => {
    try {
      const contact = await Contacts.findOne({ _id: req.params.id });
  
      res.render("view-message", {
        contact,
      });
    } catch (error) {
      console.log(error);
    }
  };


    // Delete message data
export const deleteMessage = async (req, res) => {
    try {
      await Contacts.deleteOne({ _id: req.params.id });
      res.render("success/delete-messages");
    } catch (error) {
      console.log(error);
    }
  };
