import React, { useState } from 'react';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Create this CSS file

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const register = async () => {
    try {
      await API.post('/auth/register', form);
      alert('Registered! Login now.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed');
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <img
          src="https://bsmedia.business-standard.com/_media/bs/img/article/2024-08/07/full/1722995892-9811.jpg?im=FeatureCrop,size=(500,400,200)"
          alt="FlightFinder Logo"
          className="logo"
        />
        <h2>Create Account</h2>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button className="register-btn" onClick={register}>Register</button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
