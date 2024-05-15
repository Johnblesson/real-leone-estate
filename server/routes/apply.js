import { Router } from "express";
const router = Router();

import { createApplication, getAllApplication, editApplication, deleteApplication, application, adminApplication, updateApplication } from "../controllers/apply.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// Add more routes here
router.post("/apply", ensureAuthenticated, createApplication);
router.get("/all-applications", ensureAuthenticated, getAllApplication);
router.get("/edit-application/:id", ensureAuthenticated, isAdmin, editApplication);
router.delete("/delete-application/:id", ensureAuthenticated, deleteApplication);
router.get("/delete-application/:id", ensureAuthenticated, isAdmin, deleteApplication);

router.get('/application-form', ensureAuthenticated, application)
router.get('/admin-application-form', ensureAuthenticated, adminApplication)
router.patch('/update-admin-application/:id', ensureAuthenticated, isAdmin, updateApplication);


export default router;