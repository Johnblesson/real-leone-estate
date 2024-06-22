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
    // updateApartments,
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

import { allAdminProperties, apartmentDetail, adminApartmentDetail } from '../render/render.js'
import ensureAuthenticated from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import cacheMiddleware from "../middlewares/cacheMiddleware.js"
import { checkSudoMiddleware } from '../middlewares/sudo.js'
// import { autoRefreshMiddleware } from '../middlewares/autoRefreshRoute.js';
import { uploadPhotos } from '../upload/upload.js';

// router.post('/create-apartment', upload.single('photo'), createApartment);
router.post('/create-apartment', uploadPhotos, createApartment);
router.get('/apartments', ensureAuthenticated, cacheMiddleware, getAllApartments);
router.get('/edit-apartment', ensureAuthenticated, cacheMiddleware, editapartment);
router.get('/admin-edit-apartment', ensureAuthenticated, cacheMiddleware, isAdmin, admineditapartment);
router.get('/all-properties', ensureAuthenticated, cacheMiddleware, apartmentDisplay);
router.get('/all-admin-properties', ensureAuthenticated, cacheMiddleware, allAdminProperties);
router.get('/all-apartments', ensureAuthenticated, cacheMiddleware, allApartments);
router.get('/apartments/:id', ensureAuthenticated, cacheMiddleware, getApartmentById);
router.put('/apartments/:id', ensureAuthenticated, isAdmin, updateApartmentById);
router.delete('/delete-apartments/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteApartmentById);
router.get('/delete-apartments/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteApartmentById);
// router.patch('/update-apartments/:id', ensureAuthenticated, isAdmin, updateApartments);
router.patch('/update-admin-apartments/:id', ensureAuthenticated, checkSudoMiddleware, isAdmin, updateAdminApartments);
router.get('/view-apartmet-details/:id', ensureAuthenticated, cacheMiddleware, isAdmin, viewapartment);
router.get("/edit-admin-apartment/:id", ensureAuthenticated, cacheMiddleware, isAdmin, adminEditApartments);
router.patch("/edit-admin-apartment/:id", ensureAuthenticated, isAdmin, updateAdminApartments);
router.get("/apartment-detail/:id", ensureAuthenticated, cacheMiddleware, apartmentDetail);
router.get("/apartment-detail-admin/:id",ensureAuthenticated, cacheMiddleware, adminApartmentDetail)

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