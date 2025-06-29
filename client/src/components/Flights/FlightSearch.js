import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./FlightSearch.css";

const FlightSearch = () => {
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { from, to, startDate, endDate, tripType, travelClass = "Economy" } = location.state || {};

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Outbound flight search
      const outboundParams = new URLSearchParams({ from, to, date: startDate });
      const outboundRes = await fetch(`http://localhost:5000/api/flights/search?${outboundParams}`);
      if (!outboundRes.ok) throw new Error("Outbound flight fetch failed");
      const outboundData = await outboundRes.json();
      setOutboundFlights(outboundData);

      // Return flight search for round trip
      if (tripType === "ROUND TRIP" && endDate) {
        const returnParams = new URLSearchParams({ from: to, to: from, date: endDate });
        const returnRes = await fetch(`http://localhost:5000/api/flights/search?${returnParams}`);
        if (!returnRes.ok) throw new Error("Return flight fetch failed");
        const returnData = await returnRes.json();
        setReturnFlights(returnData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const goToBookingPage = (flight, returnFlight = null) => {
    navigate(`/booking/${flight._id}`, {
      state: {
        flight,
        returnFlight,
        travelClass,
        isRoundTrip: !!returnFlight,
      },
    });
  };

  return (
    <div className="flight-search-container">
      <h2>✈️ Search Results</h2>

      <p>
        <strong>From:</strong> {from} &nbsp;&nbsp; 
        <strong>To:</strong> {to} &nbsp;&nbsp; 
        <strong>Start:</strong> {startDate} &nbsp;&nbsp; 
        {endDate && <><strong>Return:</strong> {endDate}</>}
      </p>

      {loading && <p>Loading flights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3> Departure Flights</h3>
      {outboundFlights.length > 0 ? (
        <table className="flight-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Date</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {outboundFlights.map((flight) => (
              <tr key={flight._id}>
                <td>{flight.airline}</td>
                <td>{flight.from}</td>
                <td>{flight.to}</td>
                <td>{flight.departureTime || "20:30"}</td>
                <td>{flight.arrivalTime || "5:30"}</td>
                <td>{flight.date}</td>
                <td>₹{flight.price}</td>
                <td>
                  {tripType === "ROUND TRIP" && returnFlights.length > 0 ? (
                    returnFlights.map((rf) => (
                      <button key={rf._id} onClick={() => goToBookingPage(flight, rf)}>
                        Book with Return
                      </button>
                    ))
                  ) : (
                    <button onClick={() => goToBookingPage(flight)}>Book Now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No outbound flights found.</p>
      )}

      {tripType === "ROUND TRIP" && returnFlights.length > 0 && (
        <>
          <h3>Return Flights</h3>
          <table className="flight-table">
            <thead>
              <tr>
                <th>Flight</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {returnFlights.map((flight) => (
                <tr key={flight._id}>
                  <td>{flight.airline}</td>
                  <td>{flight.from}</td>
                  <td>{flight.to}</td>
                  <td>{flight.departureTime || "10:00"}</td>
                  <td>{flight.arrivalTime || "16:00"}</td>
                  <td>{flight.date}</td>
                  <td>₹{flight.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/dashboard">
          <button className="search-btn">⬅ Return to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default FlightSearch;
