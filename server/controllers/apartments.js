import Apartments from '../models/apartments.js';

// Controller function to create a new apartment
const createApartment = async (req, res) => {
  try {
    const newApartment = new Apartments(req.body);
    const savedApartment = await newApartment.save();
    res.status(201).json(savedApartment);
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

export {
  createApartment,
  getAllApartments,
  getApartmentById,
  updateApartmentById,
  deleteApartmentById,
};
