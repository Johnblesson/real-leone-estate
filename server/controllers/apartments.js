import Apartments from '../models/apartments.js';

// Controller function to create a new apartment
const createApartment = async (req, res) => {
  try {
    // Check if req.file exists and has a value
    if (!req.file) {
      // Handle the case where no file was uploaded
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new Apartments object with form data
    const apartmentData = new Apartments({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
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

 // Controller function to get all apartments

const apartmentDisplay = async (req, res) => {
  try {
    const apartments = await Apartments.find();
    let relativePath = ''; // Declare relativePath outside the if block

    // Transform the photo path to match the URL served by Express
    if (apartments && apartments.apartmentsPhoto) {
      const photoPath = apartments.apartmentsPhoto.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      relativePath = photoPath.replace('public/assets/', '/assets/'); // Remove "public/assets/" prefix and add "/assets/" route prefix
    }

    const locals = {
      title: "All Properties",
      description: "This is the all properties page.",
    };

    res.render("/all-properties", {
      locals,
      apartments, // Pass the transformed users data to the EJS template
      relativePath, // Pass the transformed photo path to the EJS template
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching users profile.");
  }
};

//Get all apartments on a list
export const getListedApartments = async (req, res) => {
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

export {
  createApartment,
  getAllApartments,
  getApartmentById,
  updateApartmentById,
  deleteApartmentById,
  apartmentDisplay,
};
