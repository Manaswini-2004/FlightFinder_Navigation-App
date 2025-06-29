import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    };
    fetch();
  }, []);
   const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(prev => prev.filter(b => b._id !== id));
      } catch (err) {
        alert("Failed to cancel booking");
      }
    }
  };

  return (
    <div className="admin-bookings-container">
      <h1 className="admin-bookings-title">All Bookings</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>User</th>
            <th>Flight</th>
            <th>Class</th>
            <th>Status</th>
             <th>Passengers</th>
            <th>Booking Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={b._id}>
              <td>{index + 1}</td>
              <td>{b.user?.name || "N/A"}</td>
              <td>{b.flight?.airline || "N/A"}</td>
              <td>{b.travelClass}</td>
              <td>{b.status}</td>
               <td>{b.passengers?.length || 0}</td>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => alert(JSON.stringify(b, null, 2))}>View</button>
                <button onClick={() => handleCancel(b._id)} style={{ color: "red" }}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
