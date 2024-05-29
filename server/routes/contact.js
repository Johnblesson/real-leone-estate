import { Router } from "express";
const router = Router();

import { createContacts, getContactForm, getAllContacts, messageView, deleteMessage, getAdminContactForm } from "../controllers/contact.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { checkSudoMiddleware } from '../middlewares/sudo.js'
import cacheMiddleware from "../middlewares/cacheMiddleware.js"
import { isAdmin } from "../middlewares/isAdmin.js";

// Add more routes here
router.get('/contact', ensureAuthenticated, cacheMiddleware, getContactForm);
router.get('/admin-contact', ensureAuthenticated, cacheMiddleware, isAdmin, getAdminContactForm);
router.post('/contact', ensureAuthenticated, createContacts);
router.get('/all-messages', ensureAuthenticated, cacheMiddleware, isAdmin, getAllContacts);
router.get('/view-message/:id', ensureAuthenticated, isAdmin, cacheMiddleware, messageView)
router.delete('/delete-message/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteMessage);
router.get('/delete-message/:id', ensureAuthenticated, isAdmin, checkSudoMiddleware, deleteMessage);

export default router;