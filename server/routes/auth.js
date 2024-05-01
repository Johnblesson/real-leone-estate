import { Router } from "express";
const router = Router();

import { signUp, logIn, edituser, updateUser } from "../controllers/auth.js";
import { getLoginPage } from "../controllers/auth.js";
import upload from "../upload/upload.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

//Auth Routes
router.post("/signup", upload.single("photo"), signUp);
router.post("/login", logIn);

router.get("/", getLoginPage);

router.get("/edit-user/:id", edituser);
router.patch("/edit-user/:id", updateUser)

// Logout route
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect('/'); 
});

export default router;