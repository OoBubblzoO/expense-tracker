// displays list of expenses
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddExpenseForm from './AddExpenseForm';
import CategoryChart from './CategoryChart';
import { Table, TableData, Button, Text, Group, ScrollArea, Paper, TextInput, NumberInput } from '@mantine/core';


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
        <Paper shadow="xs" radius="xs" p="xl">
            <Text align="center" size="xl" fw={700} mb="md">
                Expense Tracker
            </Text>
            
            <AddExpenseForm onExpenseAdded={fetchExpenses} /> {/* New Form Component */}
            
            <ScrollArea>
                <Table striped highlightOnHover withBorder>
                    <thead>
                        <tr>
                            <th style= {{ textAlign: 'center' }}>ID</th>
                            <th style= {{ textAlign: 'center' }}>Date</th>
                            <th style= {{ textAlign: 'center' }}>Category</th>
                            <th style= {{ textAlign: 'center' }}>Amount ($)</th>
                            <th style= {{ textAlign: 'center' }}>Description</th>
                            <th style= {{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr key={expense.id}>
                                    {editingExpense?.id === expense.id ? (
                                        <>
                                            {/* Editing */}
                                            <td style= {{ textAlign: 'center' }}>{expense.id}</td>
                                            <td style= {{ textAlign: 'center' }}>
                                                <TextInput
                                                 type="date" 
                                                 name="date" 
                                                 value={updatedData.date} 
                                                 onChange={(e) => handleChange(e)} 
                                                 size="xs"
                                            />
                                            </td>
                                            <td style= {{ textAlign: 'center' }}>
                                                <TextInput
                                                 type="text" 
                                                 name="category" 
                                                 value={updatedData.category} 
                                                 onChange={(e) => handleChange(e)}
                                                 size="xs" 
                                                 />
                                                </td>
                                            <td style= {{ textAlign: 'center' }}>
                                                <NumberInput 
                                                 name="amount" 
                                                 value={updatedData.amount} 
                                                 onChange={(val) => setUpdatedData({...updatedData, amount: val})}
                                                 size="xs"
                                                 precision={2} 
                                                 />
                                                 </td>
                                            <td style= {{ textAlign: 'center' }}>
                                                <TextInput
                                                 type="text" 
                                                 name="description" 
                                                 value={updatedData.description} 
                                                 onChange={(e) => handleChange(e)}
                                                 size="xs"
                                                 />
                                                 </td>
                                            <td style= {{ textAlign: 'center' }}>
                                                <Group position="center" spacing="xs">
                                                    <Button color="blue" size="xs" onClick={() => handleUpdate(expense.id)}>Save</Button>
                                                    <Button color="red" size="xs" onClick={() => setEditingExpense(null)}>Cancel</Button>
                                                </Group>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {/* Normal */}
                                            <td style= {{ textAlign: 'center' }}>{expense.id}</td>
                                            <td style= {{ textAlign: 'center' }}>{expense.date}</td>
                                            <td style= {{ textAlign: 'center' }}>{expense.category}</td>
                                            <td style= {{ textAlign: 'center' }}>${expense.amount.toFixed(2)}</td>
                                            <td style= {{ textAlign: 'center' }}>{expense.description}</td>
                                            <td style= {{ textAlign: 'center' }}>
                                            <Group position="center" spacing="xs">
                                                <Button color="blue" size="xs" onClick={() => handleEdit(expense)}>Edit</Button>
                                                <Button color="red" size="xs" onClick={() => handleDelete(expense.id)}>Delete</Button>
                                            </Group>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </Table>
                </ScrollArea>    
                <div>
                <CategoryChart />
                
            </div>
        </Paper>
    );
};

export default ExpenseTable;
