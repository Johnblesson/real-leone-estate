import { Router } from "express";
const router = Router();

import {
    createApartment,
    getAllApartments,
    getApartmentById,
    updateApartmentById,
    deleteApartmentById,
} from '../controllers/apartments.js';
import ensureAuthenticated from '../middlewares/auth.js';
import upload from '../upload/upload.js';

router.post('/create-apartment', upload.single('apartmentsPhoto'), createApartment);
router.get('/apartments', getAllApartments);
router.get('/apartments/:id', getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, updateApartmentById);
router.delete('/apartments/:id', ensureAuthenticated, deleteApartmentById);

export default router;