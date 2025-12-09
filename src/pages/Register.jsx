import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!/^[A-Za-z ]{3,}$/.test(form.name.trim()))
      newErrors.name = "Name must be at least 3 letters long.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address.";

    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        form.password
      )
    )
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, number, and special character.";

    if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone number must be 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        }),
      });

      if (res.ok) {
        setToastMessage("🎉 Registration successful! Redirecting...");
        setShowToast(true);
        setForm({ name: "", email: "", password: "", phone: "", role: "donor" });

        setTimeout(() => {
          setShowToast(false);
          navigate("/login");
        }, 2000);
      } else {
        const data = await res.json();
        setToastMessage("Error: " + data.message);
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage("Error: " + err.message);
      setShowToast(true);
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="auth-card">

          {/* FIXED: First-Level Heading Required by WAVE */}
          <h1 className="auth-title text-center mb-4">
            Create Your ShareBite Account
          </h1>

          <form onSubmit={handleSubmit} noValidate>

            {/* NAME */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control auth-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control auth-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control auth-input"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {/* PHONE */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control auth-input"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>

            {/* ROLE */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                className="form-select auth-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                aria-required="true"
              >
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* BUTTON WITH PROPER CONTRAST */}
            <button
              type="submit"
              className="btn auth-btn w-100"
              style={{
                backgroundColor: "#0050d8",
                color: "white",
                fontWeight: "600",
              }}
              aria-label="Register"
            >
              Register
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/login")}
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {showToast && (
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1055 }}
          >
            <div
              className="toast align-items-center text-bg-primary show"
              role="alert"
              aria-live="polite"
            >
              <div className="d-flex">
                <div className="toast-body">{toastMessage}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  aria-label="Close notification"
                  onClick={() => setShowToast(false)}
                ></button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Register;
