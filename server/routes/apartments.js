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
    allApartments,
    adminEditApartments, // get edit apartments for admin
} from '../controllers/apartments.js';

import { allAdminProperties } from '../render/render.js'
import ensureAuthenticated from '../middlewares/auth.js';
import { checkApartmentVerification }from '../middlewares/isVerified.js';
import upload from '../upload/upload.js';

router.post('/create-apartment', upload.single('apartmentsPhoto'), createApartment);
router.get('/apartments', getAllApartments);
router.get('/edit-apartment', editapartment);
router.get('/admin-edit-apartment', admineditapartment);
router.get('/all-properties', apartmentDisplay);
router.get('/all-admin-properties', allAdminProperties);
router.get('/all-apartments', allApartments);
router.get('/apartments/:id', getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, updateApartmentById);
router.delete('/apartments/:id', ensureAuthenticated, deleteApartmentById);
router.patch('/update-apartments/:id', ensureAuthenticated, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, updateAdminApartments);

router.get("/edit-admin-apartment/:id", ensureAuthenticated, adminEditApartments);
router.patch("/edit-admin-apartment/:id", ensureAuthenticated, updateAdminApartments);

// router.get('/properties', properties);

export default router;