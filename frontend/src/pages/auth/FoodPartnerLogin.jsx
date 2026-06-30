import React from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(import.meta.env.VITE_API_URL);

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`, {
      email,
      password
    }, { withCredentials: true });

    console.log(response.data);

    navigate("/create-food"); // Redirect to create food page after login

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Log In</button>
        </form>
        <div className="auth-alt-action">
          Not registered yet? <Link to="/food-partner/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
