import { Router } from "express";
const router = Router();

import { createContacts, getContactForm, getAllContacts, messageView, deleteMessage } from "../controllers/contact.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// Add more routes here
router.get('/contact', ensureAuthenticated, getContactForm);
router.post('/contact', ensureAuthenticated, createContacts);
router.get('/all-messages', ensureAuthenticated, isAdmin, getAllContacts);
router.get('/view-message/:id', ensureAuthenticated, isAdmin,  messageView)
router.delete('/delete-message/:id', ensureAuthenticated, isAdmin, deleteMessage);
router.get('/delete-message/:id', ensureAuthenticated, isAdmin, deleteMessage);
export default router;