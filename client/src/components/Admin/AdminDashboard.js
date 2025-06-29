import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import "./AdminDashboard.css";
import { Link, useNavigate} from "react-router-dom";
const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (err) {
        setError("Unauthorized or Server Error");
      }
    };
    fetchStats();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
 const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // or navigate("/login") if you have a login page
  };
  return (
    <div className={`admin-dashboard-container ${darkMode ? "dark" : ""}`}>
      <aside className="sidebar">
        <h2>Admin</h2>
        <ul>
          
          <li><Link to="/admin/flights">Flights</Link></li>
          <li><Link to="/admin/bookings">Bookings</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
        <button onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-title">FlightFinder Admin Dashboard</h1>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="dashboard-cards">
            <div className="dashboard-card users">
              <h3>Total Users</h3>
              <p><CountUp end={stats.usersCount || 0} duration={2} /></p>
            </div>
            <div className="dashboard-card flights">
              <h3>Total Flights</h3>
              <p><CountUp end={stats.flightsCount || 0} duration={2} /></p>
            </div>
            <div className="dashboard-card bookings">
              <h3>Total Bookings</h3>
              <p><CountUp end={stats.bookingsCount || 0} duration={2} /></p>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
