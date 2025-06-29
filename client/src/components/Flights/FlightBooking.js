import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useParams } from 'react-router-dom';

export default function FlightBooking() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    API.get(`/flights/${id}`).then(res => setFlight(res.data));
  }, [id]);

  const book = async () => {
    await API.post('/bookings', { flightId: id });
    alert('Booked successfully!');
  };

  if (!flight) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h4>Booking for: {flight.from} ➡ {flight.to}</h4>
      <p>Date: {flight.date}</p>
      <p>Price: ₹{flight.price}</p>
      <button className="btn btn-success" onClick={book}>Confirm Booking</button>
    </div>
  );
}
