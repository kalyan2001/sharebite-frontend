import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecipientDashboard() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const recipientId = user?.uid || user?._id;

  // Fetch available + reserved foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const url = new URL("http://localhost:5000/api/food/available");
        if (recipientId) url.searchParams.set("recipientId", recipientId);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch food items.");
        const data = await res.json();
        setFoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [recipientId, refresh]);

  // check subscription status on load
  useEffect(() => {
    if (!recipientId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/subscriptions/status?recipientId=${recipientId}`
        );
        const data = await res.json();
        setIsSubscribed(data.subscribed);
      } catch (err) {
        console.error("❌ Subscription status error:", err);
      } finally {
        setSubscriptionChecked(true);
      }
    };

    fetchStatus();
  }, [recipientId]);

  const handleSubscribe = async () => {
    setSubscriptionLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/subscriptions/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId,
            email: user.email, // always correct
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsSubscribed(true);
        toast.success("You are now subscribed to donation alerts!");
      } else {
        toast.error(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      toast.error("Server error.");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setSubscriptionLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/subscriptions/unsubscribe",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId }),
        }
      );

      if (res.ok) {
        setIsSubscribed(false);
        toast.success("You have unsubscribed.");
      }
    } catch (err) {
      toast.error("Server error.");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Handle reserve food
  const handleReserve = async (foodId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/food/${foodId}/reserve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(
          "Food reserved successfully! You have 2 hours to pick it up."
        );
        setRefresh(!refresh);
      } else {
        toast.error(`❌ ${data.message}`);
      }
    } catch (err) {
      toast.error("Server error while reserving food.");
    }
  };

  // Confirm pickup with Geo-verification
  const handlePickup = async (foodId) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `http://localhost:5000/api/food/${foodId}/pickup`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ recipientId, latitude, longitude }),
            }
          );

          const data = await res.json();
          if (res.ok) {
            toast.success("🍽️ Pickup verified successfully!");
            setRefresh(!refresh);
          } else {
            toast.error(data.message || "❌ Verification failed.");
          }
        } catch (err) {
          toast.error("Server error during pickup verification.");
        }
      },
      (error) => {
        toast.error("❌ Location access denied or unavailable.");
      }
    );
  };

  // Countdown timer (for showing 2-hour remaining time)
  const getRemainingTime = (reservedAt) => {
    if (!reservedAt) return "";
    const endTime = new Date(new Date(reservedAt).getTime() + 2 * 60 * 60 * 1000);
    const diff = endTime - new Date();
    if (diff <= 0) return "Expired";
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m remaining`;
  };

  return (
    <>
      <Navbar />
      <section className="container py-5">
        {/* Email Subscription Card */}
        {user?.role === "recipient" && (
          <div className="row mb-4">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm border-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Left Side Text */}
                  <div>
                    <h6 className="mb-1 text-primary">
                      📧 New Donation Alerts
                    </h6>
                    <p className="text-muted small mb-0">
                      Get an email whenever a fresh donation is posted.
                    </p>
                  </div>

                  {/* Right Side Button */}
                  {!isSubscribed ? (
                    <button
                      className="btn btn-mb btn-primary"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={handleSubscribe}
                      disabled={subscriptionLoading}
                    >
                      {subscriptionLoading ? "..." : "Subscribe"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={handleUnsubscribe}
                      disabled={subscriptionLoading}
                    >
                      {subscriptionLoading ? "..." : "Unsubscribe"}
                    </button>
                  )}
                </div>

                {/* Subscribed message */}
                {isSubscribed && (
                  <p className="text-success small mt-2 mb-0 text-center">
                    ✅ You are subscribed to email alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-center text-primary mb-4">Available Donations</h1>

        {loading && <p className="text-center">Loading donations...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && foods.length === 0 && (
          <p className="text-center text-muted">
            No food items available currently.
          </p>
        )}

        <div className="row g-4">
          {foods.map((food) => {
            const expiry = new Date(food.expiryDate);
            const now = new Date();
            const expired = expiry < now;

            return (
              <div className="col-md-4" key={food._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={food.imageURL}
                    alt=""
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h2 className="card-title text-primary">{food.name}</h2>
                    <p className="card-text small text-muted">
                      {food.description}
                    </p>
                    <p className="card-text small">
                      <strong>Category:</strong> {food.category} <br />
                      <strong>Quantity:</strong> {food.quantity} <br />
                      <strong>Expires:</strong> {expiry.toLocaleString()} <br />
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          expired
                            ? "bg-danger"
                            : food.status === "available"
                            ? "bg-success"
                            : food.status === "reserved"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {expired ? "Expired" : food.status}
                      </span>
                    </p>

                    <p className="card-text small mb-2">
                      <strong>Pickup Address:</strong> <br />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          food.pickupAddress
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-muted"
                      >
                        📍 {food.pickupAddress}
                      </a>
                    </p>

                    {/*  Reserve & Pickup Buttons */}
                    {food.status === "available" && (
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => handleReserve(food._id)}
                      >
                        🛒 Reserve Food
                      </button>
                    )}

                    {food.status === "reserved" &&
                      food.reservedBy === recipientId && (
                        <div className="text-center mt-3">
                          <p className="text-muted small">
                            ⏳ {getRemainingTime(food.reservedAt)}
                          </p>
                          <button
                            className="btn btn-success w-100"
                            onClick={() => handlePickup(food._id)}
                          >
                            Mark as Picked Up
                          </button>
                        </div>
                      )}

                    {food.status === "reserved" &&
                      food.reservedBy !== recipientId && (
                        <button className="btn btn-secondary w-100" disabled>
                          🔒 Reserved by another recipient
                        </button>
                      )}

                    {food.status === "picked_up" && (
                      <button className="btn btn-success w-100" disabled>
                        Picked Up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={4000} />
      <Footer />
    </>
  );
}

export default RecipientDashboard;
