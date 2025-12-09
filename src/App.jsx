import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import RecipientDashboard from "./pages/RecipientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddFood from "./pages/AddFood";
import Donation from "./pages/Donation";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}

export default App;
