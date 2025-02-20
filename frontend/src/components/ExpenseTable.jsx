// displays list of expenses
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddExpenseForm from './AddExpenseForm';
import CategoryChart from './CategoryChart';
import { Button } from '@mantine/core';


const ExpenseTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null) // track expense being updated
    const [updatedData, setUpdatedData] = useState({date: '', category: '', amount: '', description: ''});

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/get_expenses'); // Fetch expenses from backend
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmDelete) return; // cancels delete
        
        try {
            await api.delete(`delete_expense/${id}`); // send delete request
            setExpenses(expenses.filter(expense => expense.id !== id)); // update ui
        } catch(error) {
            console.error('Error deleting expense:', error);
        }
    };

    // edit expense
    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setUpdatedData({
            date: expense.date,
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
        });
    };

    // handle input changes in edit form
    const handleChange = (e) => {
        setUpdatedData({...updatedData, [e.target.name]: e.target.value})
    };

    // submit edited expense
    const handleUpdate = async (id) => {
        try {
            await api.put(`/update_expense/${id}`, updatedData);
            setEditingExpense(null); // exit edit
            fetchExpenses(); // refresh
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    } ;

    return (
        <div>
            <h2>Expense Tracker</h2>
            <AddExpenseForm onExpenseAdded={fetchExpenses} /> {/* New Form Component */}
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <tr key={expense.id}>
                                {editingExpense?.id === expense.id ? (
                                    <>
                                        {/* Editing */}
                                        <td>{expense.id}</td>
                                        <td><input type="date" name="date" value={updatedData.date} onChange={handleChange} /></td>
                                        <td><input type="text" name="category" value={updatedData.category} onChange={handleChange} /></td>
                                        <td><input type="number" name="amount" value={updatedData.amount} onChange={handleChange} /></td>
                                        <td><input type="text" name="description" value={updatedData.description} onChange={handleChange} /></td>
                                        <td>
                                            <button color="blue" size="xs" onClick={() => handleUpdate(expense.id)}>Save</button>
                                            <button color="red" size="xs" onClick={() => setEditingExpense(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {/* Normal */}
                                        <td>{expense.id}</td>
                                        <td>{expense.date}</td>
                                        <td>{expense.category}</td>
                                        <td>${expense.amount.toFixed(2)}</td>
                                        <td>{expense.description}</td>
                                        <td>
                                            <button onClick={() => handleEdit(expense)}>Edit</button>
                                            <button onClick={() => handleDelete(expense.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                No expenses found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div>
                <CategoryChart />
            </div>
        </div>
    );
};

export default ExpenseTable;
