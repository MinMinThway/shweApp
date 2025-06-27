// src/api/userApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUsers = async (page = 0, size = 5, searchString = '') => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get(
    `${API_BASE_URL}api/v1/user/paginated?searchString=${searchString}&agentName=&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data || [];
};
// Fetch single user by ID
export const fetchUserById = async (id) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get(`${API_BASE_URL}api/v1/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

// ✅ Add this function for updating user info (including role)
export const updateUser = async (userData) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.put(`${API_BASE_URL}api/v1/user/update`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};
export const deleteUser = async (id) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.delete(`${API_BASE_URL}api/v1/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
