$(document).ready(function() {
    // Initialize the date picker
    $("#date").datepicker();

    // Handle form submission
    $('#expense-form').submit(function(e) {
        e.preventDefault();
        
        const description = $('#description').val();
        const amount = $('#amount').val();
        const date = $('#date').val();
        
        fetch('/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, amount, date })
        })
        .then(response => response.json())
        .then(data => {
            renderExpenses(data);
            updateChart(data);
        });
    });

    // Render expenses list
    function renderExpenses(expenses) {
        const expenseList = $('#expense-list');
        expenseList.empty();
        
        expenses.forEach(expense => {
            const li = $('<li class="list-group-item"></li>');
            li.html(`
                ${expense.date}: ${expense.description} - $${expense.amount}
                <button class="btn btn-danger btn-sm float-right" onclick="deleteExpense('${expense._id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `);
            expenseList.append(li);
        });
    }

    // Delete expense
    window.deleteExpense = function(id) {
        fetch(`/expenses/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            renderExpenses(data);
            updateChart(data);
        });
    };

    // Fetch expenses on load
    function fetchExpenses() {
        fetch('/expenses')
        .then(response => response.json())
        .then(data => {
            renderExpenses(data);
            updateChart(data);
        });
    }
    fetchExpenses();

    // Initialize Chart.js
    const ctx = document.getElementById('expense-chart').getContext('2d');
    let expenseChart;

    function updateChart(expenses) {
        const dates = expenses.map(expense => expense.date);
        const amounts = expenses.map(expense => expense.amount);

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Expenses',
                    data: amounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            }
        });
    }
});
