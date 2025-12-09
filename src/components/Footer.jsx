import React from "react";

function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-3 mt-5">

      {/* Social Icons */}
      <div className="d-flex justify-content-center gap-4 mt-2">

        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          aria-label="Visit our Facebook Page"
        >
          <i className="bi bi-facebook fs-4" aria-hidden="true"></i>
        </a>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          aria-label="Visit our Instagram Profile"
        >
          <i className="bi bi-instagram fs-4" aria-hidden="true"></i>
        </a>

        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          aria-label="Visit our LinkedIn Page"
        >
          <i className="bi bi-linkedin fs-4" aria-hidden="true"></i>
        </a>

        <a
          href="mailto:sharebite.foodbank@gmail.com"
          className="text-white"
          aria-label="Send us an email"
        >
          <i className="bi bi-envelope fs-4" aria-hidden="true"></i>
        </a>

      </div>

      <p className="mb-0">
        © {new Date().getFullYear()} ShareBite | Capstone Project | All rights reserved
      </p>
    </footer>
  );
}

export default Footer;
