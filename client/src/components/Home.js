// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Navigation */}
      <header className="navbar">
        <div className="container">
          <h1 className="logo">✈️  SB FlightFinder</h1>
          <nav className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register">Register</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2>Explore the Skies</h2>
          <p>Your gateway to seamless and affordable air travel.</p>
          <div className="buttons">
            <Link to="/flights" className="btn primary-btn">Search Flights</Link>
            <Link to="/login" className="btn secondary-btn">Get Started</Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="info-section features">
        <div className="container">
          <h3>Why Choose FlightFinder?</h3>
          <ul className="feature-list">
            <ul>🔍 Real-time flight search and status updates</ul>
            <ul>💳 Secure and flexible booking with multiple payment options</ul>
            <ul>🎁 Loyalty rewards and frequent flyer benefits</ul>
            <ul>🛫 Global coverage with domestic and international flights</ul>
            <ul>📱 Mobile-friendly experience for on-the-go planning</ul>
          </ul>
        </div>
      </section>

      {/* About Section */}
      <section className="info-section about">
        <div className="container">
          <h3>About FlightFinder</h3>
          <p>
            FlightFinder is your all-in-one platform for booking domestic and international flights.
            Enjoy real-time flight status, secure reservations, flexible cancellations, and loyalty rewards.
            Whether you are planning a solo trip, family vacation, or business travel – we’ve got your journey covered.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="info-section testimonials">
        <div className="container">
          <h3>What Our Travelers Say</h3>
          <div className="testimonial-list">
            <div className="testimonial">
              <p>"FlightFinder made my trip to Dubai smooth and affordable. I loved the rewards too!"</p>
              <span>- Aisha K.</span>
            </div>
            <div className="testimonial">
              <p>"I could track my flight in real-time and rebook easily after a delay. Highly recommended!"</p>
              <span>- Rohan M.</span>
            </div>
            <div className="testimonial">
              <p>"The UI is so easy and fast! Booking for my whole family took just 5 minutes."</p>
              <span>- Shruti V.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="info-section contact">
        <div className="container">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:support@flightfinder.com">support@flightfinder.com</a></p>
          <p>Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p>Address: 2nd Floor, SmartBridge HQ, Hyderabad, India</p>
          <div className="buttons">
            <a href="mailto:support@flightfinder.com" className="btn email-btn">Email Us</a>
            <a href="tel:+919876543210" className="btn call-btn">Call Now</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} FlightFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
