import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminFlights.css";

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    price: "",
  });

  const token = localStorage.getItem("token");

  const fetchFlights = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/flights", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchFlights();
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/flights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/flights", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewFlight({
        airline: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        date: "",
        price: "",
      });
      fetchFlights();
    } catch (err) {
      alert("Add flight failed: " + err.response?.data?.message || err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewFlight({ ...newFlight, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-flights-container">
      <h1 className="admin-flights-title">All Flights</h1>

      {/* Add Flight Form */}
      <form className="flight-form" onSubmit={handleAddFlight}>
        {["airline", "from", "to", "departureTime", "arrivalTime", "date", "price"].map((field) => (
          <input
            key={field}
            type={field === "price" ? "number" : field === "date" ? "date" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={newFlight[field]}
            onChange={handleInputChange}
            required
          />
        ))}
        <button type="submit" className="add-btn">➕ Add Flight</button>
      </form>

      {/*Flights Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Flight</th>
            <th>From</th>
            <th>To</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f, index) => (
            <tr key={f._id}>
              <td>{index + 1}</td>
              <td>{f.airline}</td>
              <td>{f.from}</td>
              <td>{f.to}</td>
              <td>{f.departureTime}</td>
              <td>{f.arrivalTime}</td>
              <td>
                <button onClick={() => handleDelete(f._id)} className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFlights;
