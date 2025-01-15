import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hqtuykqfqmflrljfsgkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdHV5a3FmcW1mbHJsamZzZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjgxNjIsImV4cCI6MjA1MjQ0NDE2Mn0.Vf7mHeTt_hcj2hTuE_zwN29wayyJXzz2ETG5NftXcL0";
const supabase = createClient(supabaseUrl, supabaseKey);

const EditData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productID: "",
    productName: "",
    amount: "",
    customerName: "",
    status: "SUCCESS",
    transactionDate: "",
    createBy: "",
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setForm({
          productID: data.productID || "",
          productName: data.productName || "",
          amount: data.amount || "",
          customerName: data.customerName || "",
          status: data.status === 0 ? "SUCCESS" : "FAILED",
          transactionDate: data.transactionDate
            ? new Date(data.transactionDate).toISOString().slice(0, 16)
            : "",
          createBy: data.createBy || "",
        });
      } catch (err) {
        console.error("Error fetching transaction:", err);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productID || !form.productName || !form.amount || !form.customerName || !form.transactionDate || !form.createBy) {
      alert("Please fill out all required fields!");
      return;
    }

    const updatedTransaction = {
      ...form,
      status: form.status === "SUCCESS" ? 0 : 1,
    };

    try {
      const { error } = await supabase
        .from("transactions")
        .update(updatedTransaction)
        .eq("id", id);

      if (error) throw error;

      alert("Transaction updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Error updating transaction:", err);
      alert("Failed to update transaction. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[
          { label: "Product ID", name: "productID", type: "text" },
          { label: "Product Name", name: "productName", type: "text" },
          { label: "Amount", name: "amount", type: "number" },
          { label: "Customer Name", name: "customerName", type: "text" },
          { label: "Transaction Date", name: "transactionDate", type: "datetime-local" },
          { label: "Created By", name: "createBy", type: "text" },
        ].map(({ label, name, type }, index) => (
          <div key={index}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              className="w-full border p-2 rounded"
              type={type}
              value={form[name] || ""}
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
            onClick={() => navigate("/")}
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
