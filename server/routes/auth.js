import { Router } from "express";
const router = Router();

import { signUp, logIn, edituser, updateUser, deleteUser, viewChangePwdPage, changePassword, googleAuthCallback, googleAuth, getSudoOnly, getAdminOnly, goBack } from "../controllers/auth.js";
import { getLoginPage } from "../controllers/auth.js";
import upload from "../upload/upload.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { checkSudoMiddleware } from "../middlewares/sudo.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js"

//Auth Routes
router.post("/signup", upload.single("photo"), signUp);
router.post("/login", logIn);

router.get("/login", cacheMiddleware, getLoginPage);

router.get("/edit-user/:id", ensureAuthenticated, isAdmin, edituser);
router.patch("/edit-user/:id", ensureAuthenticated, isAdmin, checkSudoMiddleware, updateUser)
router.delete("/delete-user/:id", ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteUser)
router.get("/delete-user/:id", ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteUser)
router.get("/update-password/:id", ensureAuthenticated, viewChangePwdPage)
// router.get("/update-password-user/:id", ensureAuthenticated, viewChangePwdPageUser)
router.patch("/update-password/:id", ensureAuthenticated, changePassword)

// google oauth
// router.get('/auth/google', googleAuth);
// router.get('/auth/google/callback', googleAuthCallback);

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/'); 
});

// 404 Route
router.get('/forbidden', (req, res) => {
    res.render('404');
});

// Sudo only
router.get("/sudo-only", getSudoOnly)
router.get("/admin-only", getAdminOnly)

// Route to handle goBack
router.get('/go-back', goBack);

export default router;
