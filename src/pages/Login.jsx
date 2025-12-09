import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format.";

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setToastMessage("✅ Login successful! Redirecting...");
        setShowToast(true);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          setShowToast(false);
          if (data.user.role === "admin") navigate("/admin-dashboard");
          else if (data.user.role === "donor") navigate("/donor-dashboard");
          else navigate("/recipient-dashboard");
        }, 2000);
      } else {
        setToastMessage("❌ Invalid credentials or token");
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage("❌ Error: " + err.message);
      setShowToast(true);
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="auth-card">

         
          <h1 className="auth-title text-center mb-4">Login to ShareBite</h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* EMAIL FIELD */}
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
                aria-required="true"
              />

              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                className="form-control auth-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                aria-required="true"
              />

              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

          
            <button
              type="submit"
              className="btn auth-btn w-100"
              style={{
                backgroundColor: "#0050d8",
                color: "white",
                fontWeight: "600",
              }}
              aria-label="Login"
            >
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/register")}
              >
                Register here
              </button>
            </p>

            <p>
              Forgot password?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => alert("Password reset coming soon!")}
              >
                Reset now
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
                  onClick={() => setShowToast(false)}
                  aria-label="Close notification"
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

export default Login;
