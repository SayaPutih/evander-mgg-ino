import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hqtuykqfqmflrljfsgkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdHV5a3FmcW1mbHJsamZzZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjgxNjIsImV4cCI6MjA1MjQ0NDE2Mn0.Vf7mHeTt_hcj2hTuE_zwN29wayyJXzz2ETG5NftXcL0";
const supabase = createClient(supabaseUrl, supabaseKey);

const ViewDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data: transaction, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setData({
          ...transaction,
          status_t: transaction.status === 1 ? "FAILED" : "SUCCESS",
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
        <strong>Status:</strong>{" "}
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