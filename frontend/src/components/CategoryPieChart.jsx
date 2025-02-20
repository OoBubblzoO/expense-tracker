import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/get_expenses');
                const expenses = response.data;

                // group by category and calculate totals
                const categoryTotals = {};
                expenses.forEach(expense => {
                    if (categoryTotals[expense.category]) {
                        categoryTotals[expense.category] +=  expense.amount;
                    } else {
                        categoryTotals[expense.category] = expense.amount;
                    }
                });

                // prep data for chart
                setChartData({
                    labels: Object.keys(categoryTotals), // categories
                    datasets: [
                        {
                            data: Object.values(categoryTotals), // Amount per category
                            backgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                            ],
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching response:', error)
            }
        };
        fetchExpenses();
    }, []);

    return (
        <div>
            <h3>Expense Distribution by Category</h3>
            <Pie data={chartData} />
        </div>
    );
};

export default CategoryPieChart;