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
    viewapartment,
    sponsorship,
    updateAdminSponsorship,
    editSponsorship,
} from '../controllers/apartments.js';

import { allAdminProperties, apartmentDetail } from '../render/render.js'
import ensureAuthenticated from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { checkSudoMiddleware } from '../middlewares/sudo.js'
import upload from '../upload/upload.js';

// router.post('/create-apartment', upload.single('photo'), createApartment);
router.post('/create-apartment', upload.single('photo'), createApartment);
router.get('/apartments', ensureAuthenticated, getAllApartments);
router.get('/edit-apartment', ensureAuthenticated, editapartment);
router.get('/admin-edit-apartment', ensureAuthenticated, isAdmin, admineditapartment);
router.get('/all-properties', ensureAuthenticated, apartmentDisplay);
router.get('/all-admin-properties', ensureAuthenticated, allAdminProperties);
router.get('/all-apartments', ensureAuthenticated, allApartments);
router.get('/apartments/:id', ensureAuthenticated, getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, isAdmin, updateApartmentById);
router.delete('/delete-apartments/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteApartmentById);
router.get('/delete-apartments/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteApartmentById);
router.patch('/update-apartments/:id', ensureAuthenticated, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, isAdmin, updateAdminApartments);
router.get('/view-apartmet-details/:id', ensureAuthenticated, isAdmin, viewapartment);
router.get("/edit-admin-apartment/:id", ensureAuthenticated, isAdmin, adminEditApartments);
router.patch("/edit-admin-apartment/:id", ensureAuthenticated, isAdmin, updateAdminApartments);
router.get('/apartment-detail/:id', apartmentDetail);

// router.get('/properties', properties);

router.get('/verify-apartment', checkSudoMiddleware, isAdmin, adminVerifyApartment);

router.get('/verify-update-apartment/:id', checkSudoMiddleware, isAdmin, ensureAuthenticated, verifyUpdateApartment);

router.get('/sponsorship', sponsorship)
router.get('/edit-sponsorship/:id', editSponsorship)
router.patch('/update-admin-sponsorship/:id', ensureAuthenticated, isAdmin, updateAdminSponsorship);

export default router;