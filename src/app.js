import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddData from './pages/AddData';
import EditData from './pages/EditData';
import ViewDetail from './pages/ViewDetail';

const App = () => {
  return (
    <Router>
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">Transaction Manager</h1>
          <div className="space-x-4">
            <Link
              to="/"
              className="text-white px-3 py-2 rounded-md hover:bg-blue-500 transition"
            >
              Home
            </Link>
            <Link
              to="/add"
              className="text-white px-3 py-2 rounded-md hover:bg-blue-500 transition"
            >
              Add Data
            </Link>
          </div>
        </div>
      </nav>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddData />} />
          <Route path="/edit/:id" element={<EditData />} />
          <Route path="/view/:id" element={<ViewDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
