import { Router } from "express";
const router = Router();

import { about, service, features, blog, allProperties, getPostApartment, getPostApartmentAdmin, listedProperties, allusers, guestPage } from "../render/render.js";
import { adminAbout, adminFeatures, adminService, adminBlog, termsConditions, registrationProcessStatement } from "../render/admin.js";
import { getAllUsers } from "../controllers/auth.js"
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAccountant } from "../middlewares/isAccountant.js";

// Add more routes here
// router.get("/all-properties", ensureAuthenticated, allProperties );

router.get("/", guestPage)

router.get("/sell-properties", ensureAuthenticated, );

router.get("/rent-properties", ensureAuthenticated, );

router.get("/about", ensureAuthenticated, about);

router.get("/features", ensureAuthenticated, features);

router.get("/service", ensureAuthenticated, service);

router.get("/blog", ensureAuthenticated, blog);

router.get('/create-apartment', ensureAuthenticated, getPostApartment)

router.get('/create-apartment-admin', ensureAuthenticated, isAdmin, getPostApartmentAdmin)

router.get('/listed-properties', listedProperties)

router.get('/all-users', isAdmin, ensureAuthenticated, getAllUsers)

// Post apartments success message
router.get('/admin-apartment-success', (req, res) => {
    res.render('success/admin-apartment')
})

router.get('/apartment-success', (req, res) => {
    res.render('success/user-apartment')
})

router.get("/services-fee-agreement", (req, res) => {
    res.render("service-fee-agreement")
})

router.get("/privacy-policy", (req, res) => {
    res.render("privacy-policy")
})

// Admin routes
router.get("/admin-about", ensureAuthenticated, adminAbout);

router.get("/admin-features", ensureAuthenticated, adminFeatures);

router.get("/admin-service", ensureAuthenticated, adminService);

router.get("/admin-blog", ensureAuthenticated, adminBlog);

router.get("/terms-and-conditions", termsConditions)

router.get("/registration-process-statement", registrationProcessStatement)

router.get("/signup", (req, res) => {
    res.render("signup")    
});

router.get("/apartment-success", (req, res) => {
    res.render("success/user-apartment")    
});


export default router;
