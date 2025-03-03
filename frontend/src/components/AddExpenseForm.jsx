import React, { useState } from 'react';
import { TextInput, NumberInput, Button, Group, Paper, Title, Box, FilInput } from '@mantine/core';
import { IconUpload, IconPlus } from '@tabler/icons-react';
import api from '../services/api';
import CsvUpload from './CsvUpload'; //get CSVupload to be a part of the expenseForm rather than separate

const AddExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        date: '',
        category: '',
        amount:'',
        description:'',

    });

    // Handle Input 
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.category || !formData.amount) {
            alert('Please fill in all required fields: date, category, and amount');
            return;
        }
        try {
            await api.post('/add_expense', formData);
            // reset form after a submission 
            setFormData({ 
                date:'', 
                category:'', 
                amount:'', 
                description:''
            });

            // refresh expense list
            if (onExpenseAdded) onExpenseAdded();
        } catch(error) {
            console.error('Error adding expense:', error);
            alert('Error adding expense. Please try again.');
        }
    };

    return (
        <Paper shadow="xs" p="md" withBorder mb="lg">
            <Title order={4} mb="md" >Add New Expense</Title>
            
            <Box component="form" onSubmit={handleSubmit}>
                <Group position="apart" align="flex-end" spacing="md">
                    <TextInput 
                        type="date" 
                        label="Date" 
                        value={formData.date} 
                        onChange={(e) => handleChange('date', e.target.value)} 
                        style={{ flex: 1}}
                        required />
                    <TextInput 
                        label="Category" 
                        placeholder="e.g., Food, Transportation" 
                        value={formData.category} 
                        onChange={(e) => handleChange('category', e.target.value)} 
                        required />
                    <NumberInput  
                        label="Amount ($)" 
                        placeholder="0.00" 
                        precision={2}
                        min={0}
                        value={formData.amount || ''} 
                        onChange={(val) => handleChange('amount', val)}
                        style={{ flex: 1 }} 
                        required />
                    <TextInput  
                        label="Description" 
                        placeholder="Optional details" 
                        value={formData.description} 
                        onChange={(e) => handleChange('description', e.target.value)}  
                        style={{ flex: 2 }}/>
                    <Button type="submit" color="blue" leftIcon={<IconPlus size={16} />}>
                        Add Expense
                    </Button>
                </Group>

                <Group position="left" mt="md">
                    <CsvUpload onUploadSuccess={onExpenseAdded} />
                </Group>
            </Box>
        </Paper>
    );
};

export default AddExpenseForm;