
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 


export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/users/signup`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/users/login`, userData);
  return response.data;
};


export const createTask = async (taskData, token) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTasks = async (token) => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (id, taskData, token) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTask = async (id, token) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
