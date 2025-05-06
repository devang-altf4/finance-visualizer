import React from 'react';
import { Bar } from 'react-chartjs-2';

interface Transaction {
  date: string;
  amount: number;
  description: string;
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({ transactions }) => {
  const calculateMonthlyExpenses = () => {
    const monthlyData: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().substr(-2)}`;
      
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + transaction.amount;
    });

    return monthlyData;
  };

  const monthlyExpenses = calculateMonthlyExpenses();

  const chartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyExpenses),
        backgroundColor: '#f47560',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`,
        },
      },
    },
  };

  return (
    <div>
      <h2>Monthly Expenses</h2>
      <p>Your expenses broken down by month.</p>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyExpensesChart;
