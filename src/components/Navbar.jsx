import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.svg";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  let deferredPrompt;

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
  }, []);

  // Fetch notifications (for recipients only)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "recipient") return;

    const userId = storedUser?.uid || storedUser?._id;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications?userId=${userId}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // PWA install handler
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") alert("✅ App installed successfully!");
      deferredPrompt = null;
    } else {
      alert("App already installed or not supported in this browser");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Mark all as read (for current user only)
  const handleMarkAllRead = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.uid || storedUser?._id;

    try {
      await fetch(
        `http://localhost:5000/api/notifications/mark-read/${userId}`,
        {
          method: "PUT",
        }
      );

      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("❌ Error marking notifications as read:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a
          className="navbar-brand d-flex align-items-center fw-bold text-primary"
          href="/"
        >
          <img
            src={logo}
            alt="ShareBite Logo"
            style={{ height: "35px", width: "35px", marginRight: "8px" }}
          />
          ShareBite
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation menu"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-primary mx-2"
                    onClick={handleInstall}
                  >
                    📲 Download App
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Role-based dashboard links */}
                {user.role === "donor" && (
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-success mx-2"
                      onClick={() => navigate("/donor-dashboard")}
                    >
                      Donor Dashboard
                    </button>
                  </li>
                )}

                {user.role === "recipient" && (
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-success mx-2"
                      onClick={() => navigate("/recipient-dashboard")}
                    >
                      Recipient Dashboard
                    </button>
                  </li>
                )}

                {user.role === "admin" && (
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-success mx-2"
                      onClick={() => navigate("/admin-dashboard")}
                    >
                      Admin Dashboard
                    </button>
                  </li>
                )}

                {/* Donor Add Food Button */}
                {user.role === "donor" && (
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-primary mx-2"
                      onClick={() => navigate("/add-food")}
                    >
                      ➕ Add Food
                    </button>
                  </li>
                )}

                {/* Notification dropdown (Recipients only) */}
                {user.role === "recipient" && (
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-outline-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      //aria-expanded="false"
                      aria-label="Notifications"
                    >
                      🔔{" "}
                      {notifications.some((n) => !n.isRead) && (
                        <span className="badge bg-danger ms-1">
                          {notifications.filter((n) => !n.isRead).length}
                        </span>
                      )}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {notifications.length === 0 ? (
                        <li>
                          <span className="dropdown-item text-muted">
                            No new notifications
                          </span>
                        </li>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <li key={n._id}>
                            <span className="dropdown-item small">
                              {n.message} <br />
                              <small className="text-muted">
                                {new Date(n.createdAt).toLocaleString()}
                              </small>
                            </span>
                          </li>
                        ))
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-center text-primary"
                          onClick={handleMarkAllRead}
                        >
                          Mark all as read
                        </button>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => navigate("/donate")}
                  >
                    💲 Donate
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => navigate("/about")}
                  >
                    About
                  </button>
                </li>

                {/* Profile info */}
                <li className="nav-item d-flex align-items-center mx-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="profile"
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  />
                  <span className="fw-semibold text-primary">
                    {user.name || "User"}
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger mx-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
