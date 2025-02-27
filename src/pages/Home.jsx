import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqtuykqfqmflrljfsgkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdHV5a3FmcW1mbHJsamZzZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjgxNjIsImV4cCI6MjA1MjQ0NDE2Mn0.Vf7mHeTt_hcj2hTuE_zwN29wayyJXzz2ETG5NftXcL0';
const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(date));

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transactionDate', { ascending: false });

      if (error) throw error;

      const groupedTransactions = data.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const createOn = new Date(transaction.createOn);

        const yearMonth = `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}`;

        if (!acc[yearMonth]) {
          acc[yearMonth] = [];
        }

        acc[yearMonth].push({
          ...transaction,
          transactionDate,
          createOn,
          status_t: transaction.status === 1 ? 'FAILED' : 'SUCCESS',
        });

        return acc;
      }, {});

      const sortedGroupedTransactions = Object.entries(groupedTransactions).sort(
        ([a], [b]) => new Date(b) - new Date(a)
      );

      setTransactions(sortedGroupedTransactions);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    setError(null);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Transactions !</h1>
      {isLoading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        transactions.map(([group, items]) => (
          <div key={group} className="mb-6">
            <h2 className="text-xl font-semibold mb-3">
              {new Date(group).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="overflow-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Product ID</th>
                    <th className="py-3 px-6 text-left">Product Name</th>
                    <th className="py-3 px-6 text-left">Amount</th>
                    <th className="py-3 px-6 text-left">Customer</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Transaction Date</th>
                    <th className="py-3 px-6 text-left">Created By</th>
                    <th className="py-3 px-6 text-left">Created On</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-6">{transaction.id}</td>
                      <td className="py-3 px-6">{transaction.productID}</td>
                      <td className="py-3 px-6">{transaction.productName}</td>
                      <td className="py-3 px-6">{transaction.amount}</td>
                      <td className="py-3 px-6">{transaction.customerName}</td>
                      <td
                        className={`py-3 px-6 font-bold ${
                          transaction.status_t === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {transaction.status_t}
                      </td>
                      <td className="py-3 px-6">{formatDate(transaction.transactionDate)}</td>
                      <td className="py-3 px-6">{transaction.createBy}</td>
                      <td className="py-3 px-6">{formatDate(transaction.createOn)}</td>
                      <td className="py-3 px-6 flex gap-2">
                        <Link
                          to={`/edit/${transaction.id}`}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                        >
                          Edit
                        </Link>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/view/${transaction.id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
