import React, { useState } from 'react';
import axios from 'axios';

const AddFlight = () => {
  const [flight, setFlight] = useState({ from: '', to: '', date: '', time: '', price: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/flights", flight);
      alert("Flight added successfully");
    } catch (err) {
      console.error(err);
      alert("Error adding flight");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Flight</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="From" onChange={e => setFlight({ ...flight, from: e.target.value })} required />
        <input className="form-control mb-2" placeholder="To" onChange={e => setFlight({ ...flight, to: e.target.value })} required />
        <input className="form-control mb-2" type="date" onChange={e => setFlight({ ...flight, date: e.target.value })} required />
        <input className="form-control mb-2" type="time" onChange={e => setFlight({ ...flight, time: e.target.value })} required />
        <input className="form-control mb-2" placeholder="Price" type="number" onChange={e => setFlight({ ...flight, price: e.target.value })} required />
        <button className="btn btn-primary">Add Flight</button>
      </form>
    </div>
  );
};

export default AddFlight;
