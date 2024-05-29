import { Router } from "express";
const router = Router();

import { homeRoute, adminHomeRoute  } from "../render/render.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js"

// Home Page Route
router.get("/home", ensureAuthenticated, homeRoute);
router.get("/admin-home", ensureAuthenticated, isAdmin, adminHomeRoute);

export default router