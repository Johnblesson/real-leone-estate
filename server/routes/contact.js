import { Router } from "express";
const router = Router();

import { createContacts, getContactForm, getAllContacts, messageView, deleteMessage } from "../controllers/contact.js";

// Add more routes here
router.get('/contact', getContactForm);
router.post('/contact', createContacts);
router.get('/all-messages', getAllContacts);
router.get('/view-message/:id',  messageView)
router.delete('/delete-message/:id', deleteMessage);
router.get('/delete-message/:id', deleteMessage);
export default router;