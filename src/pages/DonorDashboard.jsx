import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DonorDashboard() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const donorId = user?.uid || user?._id;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/food/donor/${donorId}`
        );
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
  }, [donorId]);

  return (
    <>
      <Navbar />
      <section className="container py-5">
        <h1 className="text-center text-primary mb-4">Your Donations</h1>

        {loading && <p className="text-center">Loading your donations...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && foods.length === 0 && (
          <p className="text-center text-muted">
            You haven’t added any food donations yet.
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
                    <h2 className="card-title text-primary mb-2">
                      {food.name}
                    </h2>

                    <p className="card-text small text-muted mb-2">
                      {food.description}
                    </p>

                    <p className="card-text small mb-2">
                      <strong>Category:</strong> {food.category} <br />
                      <strong>Quantity:</strong> {food.quantity} <br />
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          expired
                            ? "bg-danger"
                            : food.status === "available"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {expired ? "Expired" : food.status}
                      </span>
                    </p>

                    <p className="card-text small mb-2">
                      <strong>Expiry:</strong> {expiry.toLocaleString()}{" "}
                    </p>

                    <p className="card-text small">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default DonorDashboard;
