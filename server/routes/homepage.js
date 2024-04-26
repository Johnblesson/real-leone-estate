import { Router } from "express";
const router = Router();

import { homeRoute, adminHomeRoute  } from "../render/render.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// Home Page Route
router.get("/home", ensureAuthenticated, homeRoute);
router.get("/admin-home", ensureAuthenticated, adminHomeRoute);

export default router