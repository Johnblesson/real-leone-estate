import { Router } from "express";
const router = Router();

import { about, service, features, blog, allProperties, getPostApartment, listedProperties, allusers, } from "../render/render.js";
import { getAllUsers } from "../controllers/auth.js"
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";


// Add more routes here
// router.get("/all-properties", ensureAuthenticated, allProperties );

router.get("/sell-properties", ensureAuthenticated, );

router.get("/rent-properties", ensureAuthenticated, );

router.get("/about", ensureAuthenticated, about);

router.get("/features", ensureAuthenticated, features);

router.get("/service", ensureAuthenticated, service);

router.get("/blog", ensureAuthenticated, blog);

router.get('/create-apartment', ensureAuthenticated, getPostApartment)

router.get('/listed-properties', listedProperties)

router.get('/all-user', getAllUsers)

export default router;