import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    seats: 1,
    passengers: [{ name: "", age: "", gender: "" }],
    isRoundTrip: false,
    returnDate: "",
    returnFlightId: "",
    travelClass: "Economy",
    returnFlight: null, // to store return flight info
  });

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/flights/${id}`);
        const data = await res.json();
        if (res.ok) setFlight(data);
      } catch (err) {
        console.error("Error fetching flight:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }

    if (location.state?.returnFlight) {
      setFormData((prev) => ({
        ...prev,
        returnFlight: location.state.returnFlight,
        isRoundTrip: location.state.isRoundTrip || false,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "seats") {
      const seatCount = parseInt(value);
      const passengers = [...formData.passengers];
      while (passengers.length < seatCount) passengers.push({ name: "", age: "", gender: "" });
      while (passengers.length > seatCount) passengers.pop();

      setFormData((prev) => ({
        ...prev,
        seats: seatCount,
        passengers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...formData.passengers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, passengers: updated }));
  };

  const handleSelectSeats = () => {
    navigate("/select-seats", {
      state: {
        flightId: flight._id,
        seatCount: formData.seats,
        travelClass: formData.travelClass,
        formData,
        returnFlight: formData.returnFlight,
        isRoundTrip: formData.isRoundTrip,
        flight,
        segment: "departure",
      },
    });
  };

  if (loading) return <p className="booking-container">Loading flight details...</p>;

  return (
    <div className="booking-container">
      <h2>✈️ Book Your Flight</h2>

      {flight && (
        <>
          <div className="flight-card">
            <h3>{flight.airline}</h3>
            <p><strong>From:</strong> {flight.from}</p>
            <p><strong>To:</strong> {flight.to}</p>
            <p><strong>Date:</strong> {flight.date}</p>
            <p><strong>Departure:</strong> {flight.departureTime}</p>
            <p><strong>Arrival:</strong> {flight.arrivalTime}</p>
            <p><strong>Price:</strong> ₹{flight.price}</p>
          </div>

          {formData?.returnFlight && (
            <div className="flight-card" style={{ borderColor: "#38bdf8", borderWidth: "2px" }}>
              <h3>{formData.returnFlight.airline} (Return)</h3>
              <p><strong>From:</strong> {formData.returnFlight.from}</p>
              <p><strong>To:</strong> {formData.returnFlight.to}</p>
              <p><strong>Date:</strong> {formData.returnFlight.date}</p>
              <p><strong>Departure:</strong> {formData.returnFlight.departureTime}</p>
              <p><strong>Arrival:</strong> {formData.returnFlight.arrivalTime}</p>
              <p><strong>Price:</strong> ₹{formData.returnFlight.price}</p>
            </div>
          )}

          <form className="booking-form">
            {formData.passengers.map((p, i) => (
              <div key={i} className="passenger-form">
                <h4>Passenger {i + 1}</h4>
                <label>👤 Name</label>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                  required
                />

                <label>🎂 Age</label>
                <input
                  type="number"
                  value={p.age}
                  onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                  required
                />

                <label>⚧️ Gender</label>
                <select
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(i, "gender", e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}

            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>✈️ Class</label>
            <select name="travelClass" value={formData.travelClass} onChange={handleChange}>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>

            <label>🪑 Number of Seats</label>
            <input
              type="number"
              name="seats"
              min="1"
              max="10"
              value={formData.seats}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={handleSelectSeats}
              style={{
                backgroundColor: "#22c55e",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              🎫 Select Seats & Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default BookingPage;
