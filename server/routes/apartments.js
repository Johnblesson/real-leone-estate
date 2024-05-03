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
    adminVerifyApartment,
    verifyUpdateApartment,
} from '../controllers/apartments.js';

import { allAdminProperties } from '../render/render.js'
import ensureAuthenticated from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { checkApartmentVerification }from '../middlewares/isVerified.js';
import upload from '../upload/upload.js';

router.post('/create-apartment', upload.single('apartmentsPhoto'), createApartment);
router.get('/apartments', ensureAuthenticated, getAllApartments);
router.get('/edit-apartment', ensureAuthenticated, editapartment);
router.get('/admin-edit-apartment', ensureAuthenticated, isAdmin, admineditapartment);
router.get('/all-properties', ensureAuthenticated, apartmentDisplay);
router.get('/all-admin-properties', ensureAuthenticated, allAdminProperties);
router.get('/all-apartments', ensureAuthenticated, allApartments);
router.get('/apartments/:id', ensureAuthenticated, getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, updateApartmentById);
router.delete('/apartments/:id', ensureAuthenticated, deleteApartmentById);
router.patch('/update-apartments/:id', ensureAuthenticated, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, updateAdminApartments);

router.get("/edit-admin-apartment/:id", ensureAuthenticated, adminEditApartments);
router.patch("/edit-admin-apartment/:id", ensureAuthenticated, updateAdminApartments);

// router.get('/properties', properties);

router.get('/verify-apartment', isAdmin, adminVerifyApartment);

router.get('/verify-update-apartment/:id', isAdmin, ensureAuthenticated, verifyUpdateApartment);

export default router;