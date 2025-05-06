import { Bar } from 'react-chartjs-2';

interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export default function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const calculateMonthlyExpenses = () => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      // Use yyyy-MM as key to ensure proper sorting
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Sort by month key
    const sortedEntries = Object.entries(monthlyData).sort((a, b) => a[0].localeCompare(b[0]));

    // Format the labels for display
    return {
      labels: sortedEntries.map(([key]) => {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return date.toLocaleString('default', { month: 'short', year: '2-digit' });
      }),
      data: sortedEntries.map(([_, value]) => value)
    };
  };

  const { labels, data } = calculateMonthlyExpenses();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data,
        backgroundColor: '#f47560',
      },
    ],
  };

  return <Bar data={chartData} />;
}