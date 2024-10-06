import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    try {
      const response = await axios.post('https://backend-two-liard.vercel.app/api/users/signup', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', formData.username); 
      navigate('/tasks'); 
    } catch (error) {
      console.error('Error during signup:', error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={`border p-2 mb-4 w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.username && <p className="text-red-500 text-xs mb-2">{errors.username}</p>}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`border p-2 mb-4 w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`border p-2 mb-4 w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Sign Up</button>
        <p className="mt-4 text-center">
          Already have an account? 
          <Link to="/login" className="text-blue-500 hover:underline"> Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;





