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
