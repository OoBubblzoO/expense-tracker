import React, { useState } from 'react';
import api from '../services/api';

const AddExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        date: '',
        category: '',
        amount:'',
        description:'',

    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/add_expense', formData);
            console.log('Expense Added:', response.data);
            onExpenseAdded(); //referesh table
            setFormData({ date:'', category:'', amount:'', description:''}); // reset form
        } catch(error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div>
            <h3>Add Expense</h3>
            <form onSubmit={handleSubmit}>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                <input type="text" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange}  />
                <button type="submit">Add Expense</button>
            </form>
        </div>
    )
};

export default AddExpenseForm;