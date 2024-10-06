import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
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

        if (!formData.usernameOrEmail) {
            newErrors.usernameOrEmail = 'Username or Email is required';
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
            const response = await axios.post('https://backend-two-liard.vercel.app/api/users/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            navigate('/tasks');
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-4">Log In</h2>

                <input
                    type="text"
                    name="usernameOrEmail"
                    placeholder="Username or Email"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    className={`border p-2 mb-4 w-full ${errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300'}`}
                    required
                />
                {errors.usernameOrEmail && <p className="text-red-500 text-xs mb-2">{errors.usernameOrEmail}</p>}

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

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Log In</button>


                <p className="mt-4 text-center">
                    Don't have an account?
                    <Link to="/" className="text-blue-500 hover:underline"> Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
