import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  return (
    <>
      <Navbar />
      <section className="container py-5 text-center">
        <h2 className="text-primary">Admin Dashboard</h2>
        <p className="text-muted">
          This is a placeholder for the admin panel. Features will be added later.
        </p>
      </section>
      <Footer />
    </>
  );
}

export default AdminDashboard;
