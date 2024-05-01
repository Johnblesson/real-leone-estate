import Apartments from "../models/apartments.js";

// Define the middleware function
export const checkApartmentVerification = async (req, res, next) => {
    try {
      // Check if the apartment is verified
      const apartment = await Apartments.findById(req.params.apartmentId);
      
      if (!apartment) {
        return res.status(404).send("Apartment not found.");
      }
  
      if (apartment.verification !== 'verified') {
        return res.status(403).send("Apartment is not verified.");
      }
  
      // If the apartment is verified, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while checking apartment verification.");
    }
  };