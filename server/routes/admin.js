import { Router } from "express";
const router = Router();

import { mainAdmin } from "../controllers/admin.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

router.get('/administrator', isAdmin, ensureAuthenticated, mainAdmin);

export default router;