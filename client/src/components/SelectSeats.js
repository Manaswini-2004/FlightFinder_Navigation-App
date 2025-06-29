import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SelectSeats.css";

const SelectSeats = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    flightId,
    seatCount = 1,
    travelClass = "Economy",
    formData,
    returnFlight,
    isRoundTrip,
    segment = "departure",
    selectedDepartureSeats = [],
    flight,
  } = location.state || {};

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Always fresh
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(6);

  useEffect(() => {
    // Set grid size based on class
    if (travelClass === "Business") {
      setRows(6);
      setCols(5);
    } else if (travelClass === "First Class") {
      setRows(4);
      setCols(4);
    } else {
      setRows(10);
      setCols(6);
    }
  }, [travelClass]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/booked-seats/${flightId}`);
        const data = await res.json();
        if (res.ok) {
          setBookedSeats(data.bookedSeats || []);
        }
      } catch (err) {
        console.error("Error fetching booked seats", err);
      }
    };
    fetchBookedSeats();
  }, [flightId]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      alert(`You can select only ${seatCount} seat(s).`);
    }
  };

  const handleConfirmSeats = () => {
    if (selectedSeats.length !== seatCount) {
      alert(`Please select ${seatCount} seat${seatCount > 1 ? "s" : ""}`);
      return;
    }

    if (isRoundTrip && segment === "departure") {
      // Go to return flight seat selection
      navigate("/select-seats", {
        state: {
          flightId: returnFlight._id,
          seatCount,
          travelClass,
          formData,
          returnFlight,
          isRoundTrip,
          selectedDepartureSeats: selectedSeats, // preserve departure
          segment: "return",
          flight,
        },
      });
    } else {
      // Final step → Payment with both seat arrays
      navigate("/payment", {
        state: {
          flight,
          returnFlight,
          formData,
          travelClass,
          isRoundTrip,
          selectedSeats: isRoundTrip ? selectedDepartureSeats : selectedSeats,
          returnSelectedSeats: isRoundTrip ? selectedSeats : [],
        },
      });
    }
  };

  const renderSeats = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const seatElements = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seat = `${row}${alphabet[col]}`;
        const isBooked = bookedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        seatElements.push(
          <div
            key={seat}
            className={`seat ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </div>
        );
      }
    }

    return seatElements;
  };

  return (
    <div className="seat-selection-wrapper">
      <div className="seat-selection-container">
        <h2>🪑 Select Seats ({travelClass})</h2>
        <p>
          Select {seatCount} seat{seatCount > 1 ? "s" : ""} for{" "}
          <strong>{segment === "return" ? "Return Flight" : "Departure Flight"}</strong>
        </p>

        <div className="legend">
          <div><span className="seat available" /> Available</div>
          <div><span className="seat selected" /> Selected</div>
          <div><span className="seat booked" /> Booked</div>
        </div>

        <div className={`seats-grid ${travelClass.toLowerCase().replace(" ", "-")}`}>
          {renderSeats()}
        </div>

        <p style={{ marginTop: "0.5rem" }}>
          Selected Seats ({selectedSeats.length}/{seatCount}): {selectedSeats.join(", ") || "None"}
        </p>

        <button className="confirm-btn" onClick={handleConfirmSeats}>
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default SelectSeats;
