import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import kalyan from "../assets/kalyan.jpeg";
import rakshith from "../assets/rakshith.jpeg";
import isha from "../assets/isha.jpeg";
import mahesh from "../assets/mahesh.jpeg";

function About() {
  const team = [
    {
      name: "Kalyan Charagondla",
      role: "Backend Developer & Email Automation",
      img: kalyan,
    },
    {
      name: "Rakshith Dandlamudi",
      role: "Frontend Developer & PWA Integration",
      img: rakshith,
    },
    {
      name: "Isha",
      role: "Recipient Flow & UX Enhancements",
      img: isha,
    },
    {
      name: "Mahesh Cheera",
      role: "Dashboard & Database Design",
      img: mahesh,
    },
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-about text-white text-center py-5">
        <div className="container">
          <h1 className="fw-bold">About ShareBite</h1>
          <p className="lead mt-3">
            A community-driven platform to reduce food waste and help people in need.
          </p>
        </div>
      </section>

      <section className="container py-5">
        {/* Mission Section */}
        <div className="text-center mb-5">
          <h2 className="text-primary fw-bold">✨ Our Mission</h2>
          <p className="text-muted mt-3 w-75 mx-auto">
            ShareBite connects food donors and recipients in real time. Our goal is to reduce food waste,
            increase community support, and make food access faster, safer, and more dignified.
          </p>
        </div>

        {/* How It Works */}
        <div className="row text-center mb-5">
          <h2 className="text-primary fw-bold mb-4">🔄 How It Works</h2>

          <div className="col-md-4">
            <div className="step p-4 shadow-sm">
              <h3>🥗 Donors Upload Food</h3>
              <p className="text-muted">
                Restaurants & individuals upload surplus food with details & pickup location.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="step p-4 shadow-sm">
              <h3>👨‍👩‍👧‍👦 Recipients Reserve</h3>
              <p className="text-muted">
                Recipients view available items and reserve what they need instantly.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="step p-4 shadow-sm">
              <h3>📍 Pickup & Verification</h3>
              <p className="text-muted">
                Recipients confirm pickup, and the donor gets notified.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-5">
          <h2 className="text-primary fw-bold">👥 Meet the Team</h2>
        </div>

        <div className="row g-4 justify-content-center">
          {team.map((member, index) => (
            <div className="col-md-3 col-sm-6" key={index}>
              <div className="team-card p-4 text-center shadow-sm">
                <img
                  src={member.img}
                  alt=""
                  className="team-img mb-3"
                />
                <h5 className="fw-bold">{member.name}</h5>
                <p className="text-muted small">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
