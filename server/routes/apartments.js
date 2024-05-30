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
    searchApartment,
    searchApartmentAdmin,
    availabilty,
    editAvaliabilty,
    updateAdminAvaliability

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
router.patch('/update-apartments/:id', ensureAuthenticated, isAdmin, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, checkSudoMiddleware, isAdmin, updateAdminApartments);
router.get('/view-apartmet-details/:id', ensureAuthenticated, isAdmin, viewapartment);
router.get("/edit-admin-apartment/:id", ensureAuthenticated, isAdmin, adminEditApartments);
router.patch("/edit-admin-apartment/:id", ensureAuthenticated, isAdmin, updateAdminApartments);
router.get('/apartment-detail/:id', apartmentDetail);

// router.get('/properties', properties);

// search for apartments
router.get("/search", searchApartment)
router.get("/search-admin", searchApartmentAdmin)

router.get('/verify-apartment', ensureAuthenticated, isAdmin, adminVerifyApartment);
router.get('/verify-update-apartment/:id', isAdmin, ensureAuthenticated, verifyUpdateApartment);

// sponsorship
router.get('/sponsorship', isAdmin, ensureAuthenticated, sponsorship)
router.get('/edit-sponsorship/:id', isAdmin, ensureAuthenticated, editSponsorship)
router.patch('/update-admin-sponsorship/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, updateAdminSponsorship);

// availabilty
router.get('/availability', isAdmin, ensureAuthenticated, availabilty)
router.get('/edit-availability/:id', isAdmin, ensureAuthenticated, editAvaliabilty)
router.patch('/update-admin-availability/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, updateAdminAvaliability);


export default router;