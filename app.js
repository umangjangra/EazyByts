const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/expense-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the Expense schema and model
const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: String  // Storing date as a string for simplicity
});

const Expense = mongoose.model('Expense', expenseSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all expenses
app.get('/expenses', (req, res) => {
    Expense.find().then(expenses => res.json(expenses));
});

// Route to add a new expense
app.post('/expenses', (req, res) => {
    const newExpense = new Expense(req.body);
    newExpense.save().then(() => {
        Expense.find().then(expenses => res.json(expenses));
    });
});

// Route to delete an expense
app.delete('/expenses/:id', (req, res) => {
    Expense.findByIdAndDelete(req.params.id).then(() => {
        Expense.find().then(expenses => res.json(expenses));
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
