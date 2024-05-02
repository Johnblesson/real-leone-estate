import { Router } from "express";
const router = Router();

import { createApplication, getAllApplication, editApplication, deleteApplication } from "../controllers/apply.js";
import ensureAuthenticated from "../middlewares/auth.js";

// Add more routes here
router.post("/apply", ensureAuthenticated, createApplication);
router.get("/all-applications", ensureAuthenticated, getAllApplication);
router.get("/edit-application/:id", ensureAuthenticated, editApplication);
router.delete("/delete-application/:id", ensureAuthenticated, deleteApplication);
router.get("/delete-application/:id", ensureAuthenticated, deleteApplication);

export default router;