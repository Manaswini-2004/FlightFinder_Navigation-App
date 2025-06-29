import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function UpdateFlight() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const res = await API.get('/flights');
    setFlights(res.data);
  };

  const updateFlight = async (id, updated) => {
    try {
      await API.put(`/flights/${id}`, updated, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
        },
      });
      alert('Updated!');
      fetchFlights();
    } catch (err) {
      alert('Update failed');
    }
  };

  const deleteFlight = async (id) => {
    try {
      await API.delete(`/flights/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
        },
      });
      alert('Deleted!');
      fetchFlights();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Update or Delete Flights</h4>
      {flights.map(f => (
        <div key={f._id} className="card mb-2 p-3">
          <input className="form-control mb-2" defaultValue={f.from} onChange={e => f.from = e.target.value} />
          <input className="form-control mb-2" defaultValue={f.to} onChange={e => f.to = e.target.value} />
          <input className="form-control mb-2" defaultValue={f.date} onChange={e => f.date = e.target.value} />
          <input className="form-control mb-2" defaultValue={f.price} onChange={e => f.price = e.target.value} />
          <input className="form-control mb-2" defaultValue={f.seats} onChange={e => f.seats = e.target.value} />
          <button className="btn btn-primary me-2" onClick={() => updateFlight(f._id, f)}>Update</button>
          <button className="btn btn-danger" onClick={() => deleteFlight(f._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
