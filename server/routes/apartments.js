import { Router } from "express";
const router = Router();

import {
    createApartment,
    getAllApartments,
    getApartmentById,
    updateApartmentById,
    deleteApartmentById,
    apartmentDisplay,
    editapartment,
    admineditapartment,
    updateAdminApartments,
    updateApartments,
} from '../controllers/apartments.js';
import ensureAuthenticated from '../middlewares/auth.js';
import upload from '../upload/upload.js';

router.post('/create-apartment', upload.single('apartmentsPhoto'), createApartment);
router.get('/apartments', getAllApartments);
router.get('/edit-apartment', editapartment);
router.get('/admin-edit-apartment', admineditapartment);
router.get('/all-properties', apartmentDisplay);
router.get('/apartments/:id', getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, updateApartmentById);
router.delete('/apartments/:id', ensureAuthenticated, deleteApartmentById);
router.patch('/update-apartments/:id', ensureAuthenticated, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, updateAdminApartments);

export default router;