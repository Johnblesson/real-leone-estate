import { Router } from "express";
const router = Router();

import 
    { profile, 
    // updateprofile, 
    updateUser, 
    getUsers, 
    adminprofile, 
    updateadminprofile, 
    view, 
    getUpdateProfile, 
    adminUpdateProfile, 
    viewAdminProfile 
    } from "../controllers/profile.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
// import { checkSudoMiddleware } from '../middlewares/sudo.js'
import cacheMiddleware from "../middlewares/cacheMiddleware.js"

router.get('/profile/:id', ensureAuthenticated, profile);
router.get('/admin-profile/:id', ensureAuthenticated, isAdmin, adminprofile);

// router.get("/update-profile/:id", ensureAuthenticated, updateprofile);
// router.get("/update-admin-profile/:id", ensureAuthenticated, isAdmin, updateadminprofile);
router.patch('/update-profile/:id', ensureAuthenticated, updateUser);
// router.patch('/update-admin-profile/:id', ensureAuthenticated, ensureAuthenticated, isAdmin, updateUser);

router.get('/view/:id', ensureAuthenticated, cacheMiddleware, view);
router.get('/view-admin-profile/:id', ensureAuthenticated, isAdmin, viewAdminProfile);

router.get('/users', getUsers);

router.get('/update-profile/:id', ensureAuthenticated, getUpdateProfile);
router.get('/update-admin-profile/:id', ensureAuthenticated, isAdmin, adminUpdateProfile);

export default router;