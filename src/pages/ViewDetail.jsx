  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useParams } from "react-router-dom";

  const ViewDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchTransaction = async () => {
        try {
          const response = await axios.get(`https://react-back-31sufniwh-sayaputihs-projects.vercel.app/api/transactions/${id}`);
          const transaction = response.data;

          setData({
            ...transaction,
            status_t: transaction.status === 1 ?  "FAILED" : "SUCCESS",
            transactionDate: new Date(transaction.transactionDate),
            createOn: new Date(transaction.createOn),
          });
          setLoading(false);
        } catch (err) {
          setError("Failed to load transaction data.");
          setLoading(false);
        }
      };

      fetchTransaction();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>
        <p className="mb-4"><strong>ID:</strong> {data.id}</p>
        <p className="mb-4"><strong>Product ID:</strong> {data.productID}</p>
        <p className="mb-4"><strong>Product Name:</strong> {data.productName}</p>
        <p className="mb-4"><strong>Amount:</strong> ${data.amount.toLocaleString()}</p>
        <p className="mb-4"><strong>Customer Name:</strong> {data.customerName}</p>
        <p className="mb-4">
          <strong>Status:</strong>{' '}
          <span
            className={`px-2 py-1 rounded-md text-white ${
              data.status_t === "SUCCESS" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {data.status_t}
          </span>
        </p>
        <p className="mb-4"><strong>Transaction Date:</strong> {data.transactionDate.toLocaleString()}</p>
        <p className="mb-4"><strong>Created By:</strong> {data.createBy}</p>
        <p className="mb-4"><strong>Created On:</strong> {data.createOn.toLocaleString()}</p>
      </div>
    );
  };

  export default ViewDetail;
