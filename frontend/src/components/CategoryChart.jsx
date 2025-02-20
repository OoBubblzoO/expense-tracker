import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/get_expenses');
                const expenses = response.data;

                // process data & group
                const categoryTotals = {};
                expenses.forEach(expense => {

                    if (categoryTotals[expense.category]) {
                        categoryTotals[expense.category] += expense.amount;
                    } else {
                        categoryTotals[expense.category] = expense.amount;
                    }
                });

                // prep data
                setChartData({
                    labels: Object.keys(categoryTotals),
                    datasets: [
                        {
                            label: 'Total Spent ($)',
                            data: Object.values(categoryTotals), // amount per category
                            backgroundColor: 'rgba(75, 192, 192, 0.6',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
            <h3>Expenses by category</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default CategoryChart;