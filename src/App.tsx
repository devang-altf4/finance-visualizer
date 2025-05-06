import React, { useState } from 'react';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
type Transaction = {
    id: string;
    amount: number;
    description: string;
    date: string; // or Date
  };
  

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
        <button onClick={() => /* show add transaction modal */} 
                className="bg-black text-white px-4 py-2 rounded-md">
          Add Transaction
        </button>
      </div>
      
      <div className="flex flex-col space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <MonthlyExpensesChart transactions={transactions} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <p className="text-gray-600 mb-4">View and manage your recent transactions.</p>
          {/* Transaction table */}
        </div>
      </div>
    </div>
  );
}

export default App;