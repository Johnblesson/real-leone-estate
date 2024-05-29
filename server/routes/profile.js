import { Router } from "express";
const router = Router();

import { profile, updateprofile, updateUser, getUsers, adminprofile, updateadminprofile, view } from "../controllers/profile.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

router.get('/profile/:id', ensureAuthenticated, profile);
router.get('/admin-profile/:id', ensureAuthenticated, isAdmin, adminprofile);

router.get("/update-profile/:id", ensureAuthenticated, updateprofile);
router.get("/update-admin-profile/:id", ensureAuthenticated, isAdmin, updateadminprofile);
router.patch('/update-profile/:id', ensureAuthenticated, ensureAuthenticated, updateUser);
router.patch('/update-admin-profile/:id', ensureAuthenticated, ensureAuthenticated, isAdmin, updateUser);

router.get('/view/:id', view);

router.get('/users', getUsers);


export default router;