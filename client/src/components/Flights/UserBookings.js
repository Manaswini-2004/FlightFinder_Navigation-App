import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserBookings.css";
import { generateETicket } from "../../utils/generateETicket";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load bookings.");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="user-bookings-container">
      <h2>My Flight Bookings</h2>

      {loading && <p>Loading bookings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 && !loading ? (
        <p>You have not booked any flights yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Seat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const flight = booking.flight || {};
              return (
                <tr
                  key={booking._id}
                  onClick={() => generateETicket({ booking })} //Download ticket on click
                  style={{ cursor: "pointer" }}
                >
                  <td>{flight.airline || "N/A"}</td>
                  <td>{flight.from || "N/A"}</td>
                  <td>{flight.to || "N/A"}</td>
                  <td>{flight.date ? new Date(flight.date).toLocaleDateString() : "N/A"}</td>
                  <td>{booking.passengers?.length || "N/A"}</td>
                  <td>{booking.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default UserBookings;
