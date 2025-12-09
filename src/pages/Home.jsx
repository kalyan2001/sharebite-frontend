import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import banner from "../assets/banner.jpg"

function Home() {
  return (
    <>
      <Navbar />
      {/* ===== Hero Section ===== */}
      <section
        className="hero d-flex align-items-center text-center text-white"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "85vh",
        }}
      >
        <div className="container hero-overlay">
          <h1 className="display-4 fw-bold mb-3">
            Share Food, Spread Smiles
          </h1>
          <p className="lead mb-4">
            Join ShareBite to reduce food waste and help those in need.
          </p>
          <a href="#features" className="btn btn-primary btn-lg">
            Learn More
          </a>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">What You Can Do</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">🍱 Donate Food</h3>
                  <p className="card-text">
                    Have extra food? Share it with people in need safely and quickly.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">🤝 Request Help</h3>
                  <p className="card-text">
                    Are you a recipient organization or individual? Request donations nearby.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-primary">📍 Geo Verified Pickups</h3>
                  <p className="card-text">
                    Each pickup is verified using location data to ensure pickup accuracy and trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">How It Works</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="step p-3">
                <h1 className="text-primary">1️⃣</h1>
                <p>Create your donor or recipient account.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step p-3">
                <h1 className="text-primary">2️⃣</h1>
                <p>Post available food or browse nearby donations.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step p-3">
                <h1 className="text-primary">3️⃣</h1>
                <p>Coordinate pickup easily using maps and geolocation.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step p-3">
                <h1 className="text-primary">4️⃣</h1>
                <p>Track your impact and see how you’ve helped.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
