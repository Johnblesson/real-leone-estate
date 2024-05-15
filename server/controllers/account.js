import Expenses from '../models/expenses.js';
import User from '../models/auth.js';

// Controller function to create a new Expenses
export const createExpenses = async (req, res) => {
    try {
      // Extracting data from request body
      const { 
        date,
        purpose,
        amount,
        receivedBy,
        approvedBy,
        createdBy,
        username,  
        comments } = req.body;
  
      // Create a new Expenses object with form data
      const expensesForm = new Expenses({
        date,
        purpose,
        amount,
        receivedBy,
        approvedBy,
        createdBy,
        username,
        comments,
        createdAt: new Date(), // Assuming createdAt and updatedAt are Date objects
        updatedAt: new Date()
      });
  
      // Saving the Expenses to the database
      const savedExpenses = await expensesForm.save();
  
      // Sending a success response
      res.status(201).render('success/expenses')
      console.log(savedExpenses);
    } catch (error) {
      // Sending an error response
      res.status(400).json({ error: error.message });
    }
  };

export const expensesForm = async (req, res) => {

    // Function to determine the time of the day
    const getTimeOfDay = () => {
      const currentHour = new Date().getHours();
  
      if (currentHour >= 5 && currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };
  
    try {
  
      // Determine the time of the day
      const greeting = getTimeOfDay();
  
      // Check if the user is authenticated
      const user = req.isAuthenticated() ? req.user : null;
  
      // Render the apply page with the necessary data
      res.render('expense-form', {
        user,
        greeting,
      });
    } catch (error) {
      console.error('Error rendering the page:', error);
      res.status(500).send('Internal Server Error');
    }
  };


  
// Get All Users Controller
export const getAllExpenses = async (req, res) => {

    try {
      const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
      const limit = 15; // Number of entries per page
      const skip = (page - 1) * limit;
  
      // Fetch all storage data
      // const allStorage = await User.find().skip(skip).limit(limit);
      const totalEntries = await Expenses.countDocuments();
  
      const totalPages = Math.ceil(totalEntries / limit);
  
      // Fetch all users from the database
      // const users = await User.find({}, '-password'); // Exclude password field from the response
      const expenses = await Expenses.aggregate([
        { $skip: skip },
        { $limit: limit }
    ]);
    
      res.render('expenses-list', { 
        expenses: expenses, 
        currentPage: page, 
        totalPages: totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching users.');
    }
  };


// Function to calculate total amount from an array of expenses
const calculateTotalAmount = (expenses) => {
    // Initialize total amount
    let totalAmount = 0;

    // Loop through each expense and add its amount to the total
    for (const expense of expenses) {
        totalAmount += expense.amount;
    }

    return totalAmount;
};

// Acc Dashboard
export const accDashboard = async (req, res) => {
    try {
        // Function to determine the time of the day
        const getTimeOfDay = () => {
            const currentHour = new Date().getHours();

            if (currentHour >= 5 && currentHour < 12) {
                return 'Good Morning';
            } else if (currentHour >= 12 && currentHour < 18) {
                return 'Good Afternoon';
            } else {
                return 'Good Evening';
            }
        };

        const usersCount = await User.countDocuments();

        // Determine the time of the day
        const greeting = getTimeOfDay();

        // Check if the user is authenticated
        const user = req.isAuthenticated() ? req.user : null;

        // Fetch all expenses from the database
        const allExpenses = await Expenses.find();

        // Calculate total amount of expenses
        const totalExpensesAmount = calculateTotalAmount(allExpenses);

        // Render the apply page with the necessary data
        res.render('acc-dashboard', {
            user,
            greeting,
            totalExpensesAmount,
            usersCount,
        });
    } catch (error) {
        console.error('Error rendering the page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete Expenses data
export const deleteExpenses = async (req, res) => {
    try {
      await Expenses.deleteOne({ _id: req.params.id });
      res.render("success/delete-expenses");
    } catch (error) {
      console.log(error);
    }
  };


  // Get expenses page
export const editExpenses = async (req, res) => {
    const locals = {
      title: "Edit expenses",
      description: "This is the edit expenses page.",
    };
  
    // Function to determine the time of the day
    const getTimeOfDay = () => {
      const currentHour = new Date().getHours();
  
      if (currentHour >= 5 && currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };
  
    try {
      const expenses = await Expenses.findOne({ _id: req.params.id });
  
      // Determine the time of the day
      const greeting = getTimeOfDay();
  
      const user = req.isAuthenticated() ? req.user : null;
  
      res.render("expenses-update", {
        locals,
        expenses,
        greeting,
        user,
      });
    } catch (error) {
      // Handle errors gracefully
      console.error(error.message);
      res.status(404).send("User not found");
    }
  };


  // Update Admin Expenses record
export const updateExpenses = async (req, res) => {
    try {
      const { id } = req.params; // Extract the ID of the record to be updated
  
      // Find the existing Expensess record by ID and update its fields
      const updatedExpenses = await Expenses.findByIdAndUpdate(id, req.body, { new: true });
  
      // Check if the Expensess record exists
      if (!updatedExpenses) {
        return res.status(404).json({ message: 'Expenses record not found' });
      }
  
      // Respond with the updated Expensess record
      res.status(200).render('success/expenses-update', { updatedExpenses });
    } catch (error) {
      console.error('Error updating Expensess record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };