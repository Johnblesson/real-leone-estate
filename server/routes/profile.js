import { Router } from "express";
const router = Router();

import { profile, updateprofile, updateUser, getUsers, adminprofile, updateadminprofile } from "../controllers/profile.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

router.get('/profile/:id', ensureAuthenticated, profile);
router.get('/admin-profile/:id', ensureAuthenticated, adminprofile);

router.get("/update-profile/:id", updateprofile); //updateadminprofile
router.get("/update-admin-profile/:id", updateadminprofile); //updateadminprofile
router.patch('/update-profile/:id', ensureAuthenticated, updateUser);
router.patch('/update-admin-profile/:id', ensureAuthenticated, updateUser);

router.get('/users', getUsers);


export default router;