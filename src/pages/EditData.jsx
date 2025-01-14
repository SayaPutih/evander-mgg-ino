import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productID: '',
    productName: '',
    amount: '',
    customerName: '',
    status: 'SUCCESS',
    transactionDate: '',
    createBy: '', 
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`https://react-back-31sufniwh-sayaputihs-projects.vercel.app/api/transactions/${id}`);
        const data = response.data;

        setForm({
          productID: data.productID || '',
          productName: data.productName || '',
          amount: data.amount || '',
          customerName: data.customerName || '',
          status: data.status === 0 ? 'SUCCESS' : 'FAILED', 
          transactionDate: data.transactionDate ? new Date(data.transactionDate).toISOString().slice(0, 16) : '',
          createBy: data.createBy || '', 
        });
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productID || !form.productName || !form.amount || !form.customerName || !form.transactionDate || !form.createBy) {
      alert('Please fill out all required fields!');
      return;
    }

    const updatedTransaction = {
      ...form,
      status: form.status === 'SUCCESS' ? 0 : 1, 
    };

    try {
      await axios.put(`https://react-back-31sufniwh-sayaputihs-projects.vercel.app/api/transactions/${id}`, updatedTransaction);
      alert('Transaction updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Transaction Updated!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[ 
          { label: 'Product ID', name: 'productID', type: 'text' },
          { label: 'Product Name', name: 'productName', type: 'text' },
          { label: 'Amount', name: 'amount', type: 'number' },
          { label: 'Customer Name', name: 'customerName', type: 'text' },
          { label: 'Transaction Date', name: 'transactionDate', type: 'datetime-local' },
          { label: 'Created By', name: 'createBy', type: 'text' },
        ].map(({ label, name, type }, index) => (
          <div key={index}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              className="w-full border p-2 rounded"
              type={type}
              value={form[name] || ''}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditData;
