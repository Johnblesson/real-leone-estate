import { Router } from "express";
const router = Router();

import { about, service, features, blog, allProperties, getPostApartment, getPostApartmentAdmin, listedProperties, allusers, guestPage, faq } from "../render/render.js";
import { adminAbout, adminFeatures, adminService, adminBlog, termsConditions, registrationProcessStatement } from "../render/admin.js";
import { getAllUsers, allAdminUser } from "../controllers/auth.js"
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAccountant } from "../middlewares/isAccountant.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js"
import { checkSudoMiddleware } from '../middlewares/sudo.js';


// Add more routes here
// router.get("/all-properties", ensureAuthenticated, allProperties );

router.get("/", cacheMiddleware, guestPage)

router.get("/sell-properties", cacheMiddleware, ensureAuthenticated, );

router.get("/rent-properties", cacheMiddleware, ensureAuthenticated, );

router.get("/about", cacheMiddleware, cacheMiddleware, about);

router.get("/features", cacheMiddleware, cacheMiddleware, features);

router.get("/service", cacheMiddleware, cacheMiddleware, service);

router.get("/blog", cacheMiddleware, cacheMiddleware, blog);

router.get('/create-apartment', cacheMiddleware, ensureAuthenticated, getPostApartment)

router.get('/create-apartment-admin', cacheMiddleware, ensureAuthenticated, isAdmin, getPostApartmentAdmin)

router.get('/listed-properties', listedProperties)

router.get('/all-users', isAdmin, cacheMiddleware, ensureAuthenticated, getAllUsers)

router.get('/all-admin-user', isAdmin, isAccountant, cacheMiddleware, ensureAuthenticated, allAdminUser)


// Post apartments success message
router.get('/admin-apartment-success', cacheMiddleware, (req, res) => {
    res.render('success/admin-apartment')
})

router.get('/apartment-success', cacheMiddleware, (req, res) => {
    res.render('success/user-apartment')
})

router.get("/services-fee-agreement", cacheMiddleware, (req, res) => {
    res.render("service-fee-agreement")
})

router.get("/privacy-policy",  cacheMiddleware, (req, res) => {
    res.render("privacy-policy")
})

// Admin routes
router.get("/admin-about", cacheMiddleware, ensureAuthenticated, adminAbout);

router.get("/admin-features", cacheMiddleware, ensureAuthenticated, adminFeatures);

router.get("/admin-service", cacheMiddleware, ensureAuthenticated, adminService);

router.get("/admin-blog", cacheMiddleware, ensureAuthenticated, adminBlog);

router.get("/terms-and-conditions", cacheMiddleware, termsConditions)

router.get("/registration-process-statement", cacheMiddleware, registrationProcessStatement)
 
router.get("/faq", cacheMiddleware, ensureAuthenticated, faq)

router.get("/signup", cacheMiddleware, (req, res) => {
    res.render("signup")    
});

router.get("/user-apartment-success", ensureAuthenticated, cacheMiddleware, (req, res) => {
    res.render("success/user-apartment")    
});

router.get("/admin-apartment-success", ensureAuthenticated, cacheMiddleware, (req, res) => {
    res.render("success/admin-apartment")    
});

export default router;
