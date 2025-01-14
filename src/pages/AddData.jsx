import React, { useState } from 'react';
import axios from 'axios';

const AddData = () => {
  const [form, setForm] = useState({
    id: '',
    productID: '',
    productName: '',
    amount: '',
    customerName: '',
    status_t: 'SUCCESS',
    transactionDate: '',
    createdBy: '',
  });

  const resetForm = () => {
    setForm({
      id: '',
      productID: '',
      productName: '',
      amount: '',
      customerName: '',
      status_t: 'SUCCESS',
      transactionDate: '',
      createdBy: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.productID ||
      !form.productName ||
      !form.amount ||
      !form.customerName ||
      !form.transactionDate ||
      !form.createdBy
    ) {
      alert('Please fill out all required fields!');
      return;
    }

    const dataToSubmit = {
      id: form.id || null,
      productID: form.productID,
      productName: form.productName,
      amount: parseFloat(form.amount),
      customerName: form.customerName,
      status: form.status_t === 'SUCCESS' ? 0 : 1,
      transactionDate: form.transactionDate,
      createBy: form.createdBy,
      createOn: new Date().toISOString(),
    };

    try {
      const response = await axios.post('https://react-back-31sufniwh-sayaputihs-projects.vercel.app/api/transactions', dataToSubmit);
      alert(`Transaction added successfully! ID: ${response.data.id}`);
      resetForm();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(`Failed to add transaction. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[
          { label: 'Transaction ID', name: 'id', type: 'text' },
          { label: 'Product ID', name: 'productID', type: 'text' },
          { label: 'Product Name', name: 'productName', type: 'text' },
          { label: 'Amount', name: 'amount', type: 'number' },
          { label: 'Customer Name', name: 'customerName', type: 'text' },
          { label: 'Transaction Date', name: 'transactionDate', type: 'datetime-local' },
          { label: 'Created By', name: 'createdBy', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              className="w-full border p-2 rounded"
              type={type}
              name={name}
              value={form[name]}
              onChange={handleInputChange}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="w-full border p-2 rounded"
            name="status_t"
            value={form.status_t}
            onChange={handleInputChange}
          >
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={resetForm}
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Transaction Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddData;
