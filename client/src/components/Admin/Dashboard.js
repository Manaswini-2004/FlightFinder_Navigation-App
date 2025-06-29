import React, { useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("ROUND TRIP");
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [travelClass, setTravelClass] = useState("Economy");

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

 
 const handleSearch = async () => {
  if (!from || !to || !startDate) {
    alert("Please fill in From, To, and Start Date");
    return;
  }

  try {
    const { data } = await axios.get("http://localhost:5000/api/flights/search", {
      params: {
        from,
        to,
        date: startDate,
         tripType: activeTab,
        travelClass,
      },
    });

    if (data.length > 0) {
      navigate("/flights", {
        state: { from, to, startDate, endDate, tripType: activeTab, travelClass },
      });
    } else {
      alert("No flights found for your search criteria.");
    }
  } catch (err) {
    console.error("Flight search error:", err.message);
    alert("Something went wrong while searching for flights.");
  }
};


  const renderTabContent = () => {
    switch (activeTab) {
      case "ROUND TRIP":
        return (
          <div className="booking-card">
            <div className="form-grid">
              <input type="text" placeholder="From" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
              <input type="text" placeholder="To" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
              <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <div className="checkbox-row">
                <input type="checkbox" id="flex1" />
                <label htmlFor="flex1">Flexible with date</label>
              </div>
              <select className="input col-span-2"value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                <option value="Economy">Economy</option>
  <option value="Business">Business</option>
  <option value="First Class">First Class</option>
              </select>
              
              
            </div>
            <div className="text-center mt-6">
              <button className="search-btn" onClick={handleSearch}>Search Flights</button>
            </div>
          </div>
        );

      case "ONE WAY":
        return (
          <div className="booking-card">
            <div className="form-grid">
              <input type="text" placeholder="From" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
              <input type="text" placeholder="To" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
              <input type="date" className="input col-span-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <select className="input col-span-2" value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
  <option value="Economy">Economy</option>
  <option value="Business">Business</option>
  <option value="First Class">First Class</option>
</select>

            </div>
            <div className="text-center mt-6">
              <button className="search-btn" onClick={handleSearch}>Search One-Way Flights</button>
            </div>
          </div>
        );

      case "MULTI CITY":
        return (
          <div className="booking-card">
            <div className="form-grid">
              <input type="text" placeholder="City 1" className="input" />
              <input type="date" className="input" />
              <input type="text" placeholder="City 2" className="input" />
              <input type="date" className="input" />
            </div>
            <div className="text-center mt-6">
              <button className="search-btn" onClick={() => navigate("/flights")}>Search Multi-City Flights</button>
            </div>
          </div>
        );

     

       case "TOURISTER":
  return (
    <div className="booking-card">
      <h2>🎖️ Valued Tourister Rewards</h2>
      <p>
        Welcome to the <strong>Tourister Elite Club</strong>, our special rewards program for frequent flyers.
        As a Tourister, you get exclusive benefits that elevate your travel experience.
      </p>

      <h3>🎁 Exclusive Perks:</h3>
      <ul>
        <li>✔️ Priority Check-in and Security</li>
        <li>✔️ Access to Premium Lounges</li>
        <li>✔️ Free Upgrades (as available)</li>
        <li>✔️ 24/7 Travel Concierge Support</li>
        <li>✔️ 20% Discount on International Routes</li>
      </ul>

      <h3>✨ How to Earn More:</h3>
      <p>
        Book more flights through FlightFinder, explore new destinations, and share your travel experiences to earn bonus rewards.
      </p>

      <img
        src="/images/tourister-perks.jpg"
        alt="Tourister Benefits"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

     case "DESTINATIONS":
  return (
    <div className="booking-card">
      <h2>🌍 Most Traveled Destinations</h2>
      <p>
        Discover the world with FlightFinder. Here are the top places our travelers love the most:
      </p>

      <ul>
        <li>
          <strong>🌆 Dubai:</strong> A futuristic city with breathtaking skyscrapers, desert safaris, and luxury shopping.
        </li>
        <li>
          <strong>🏙 Singapore:</strong> Famous for its cleanliness, Marina Bay skyline, Sentosa Island, and vibrant nightlife.
        </li>
        <li>
          <strong>🇮🇳 New Delhi:</strong> A cultural epicenter with rich heritage, bustling markets, and historic monuments.
        </li>
        <li>
          <strong>🗼 Paris:</strong> The romantic capital of the world, home to the Eiffel Tower, Louvre, and cozy cafes.
        </li>
        <li>
          <strong>🗽 New York:</strong> The city that never sleeps — Broadway, Central Park, Times Square, and more.
        </li>
        <li>
          <strong>🏖 Bali:</strong> Indonesia's paradise island with serene beaches, lush forests, and temples.
        </li>
      </ul>

      <p style={{ marginTop: "1rem" }}>
        ✈️ <strong>Pro Tip:</strong> Book during off-seasons for up to 40% discounts and fewer crowds!
      </p>

      <img
        src="/images/destinations-map.jpg"
        alt="World Travel Map"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

      default:
        return null;
    }
  };

  const tabs = ["ROUND TRIP", "ONE WAY", "MULTI CITY",  "TOURISTER", "DESTINATIONS"];

  return (
    <div className="dashboard-container">
      <div className="overlay"></div>
      <div className="dashboard-content">
        <h1 className="title">Flight Ticket Booking</h1>

        <div style={{ textAlign: "right", marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
  <button className="search-btn" onClick={() => navigate("/my-bookings")}>
    My Bookings
  </button>
  <button className="search-btn" onClick={handleLogout} style={{ backgroundColor: "#dc3545" }}>
    Logout
  </button>
</div>


        <div className="tabs">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {renderTabContent()}
        <div className="footer">© 2025 FlightFinder. All Rights Reserved.</div>
      </div>
    </div>
  );
};

export default Dashboard;
