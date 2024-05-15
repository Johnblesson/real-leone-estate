import { Router } from "express";
const router = Router();

import { expensesForm, createExpenses, getAllExpenses, accDashboard, deleteExpenses, editExpenses, updateExpenses, createTransactions, transactionsForm, getAllTransactions } from "../controllers/account.js";
import ensureAuthenticated from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAccountant } from "../middlewares/isAccountant.js";

// Expenses Routes
router.get("/expenses-form", ensureAuthenticated, isAccountant, isAdmin, expensesForm);
router.post("/expenses", ensureAuthenticated, isAccountant, isAdmin, createExpenses);
router.get("/all-expenses", ensureAuthenticated, isAccountant, isAdmin, getAllExpenses);
router.get("/account", ensureAuthenticated, isAccountant, isAdmin, accDashboard);
router.delete("/delete-expenses/:id", ensureAuthenticated, isAccountant, isAdmin, deleteExpenses);
router.get("/delete-expenses/:id", ensureAuthenticated, isAccountant, isAdmin, deleteExpenses);
router.get("/edit-expenses/:id", ensureAuthenticated, isAccountant, isAdmin, editExpenses);
router.patch("/update-expenses/:id", ensureAuthenticated, isAccountant, isAdmin, updateExpenses);

// Transactions Routes
router.post("/transaction-form", createTransactions)
router.get("/transaction-form", transactionsForm)
router.get("/all-transactions", getAllTransactions)

export default router;