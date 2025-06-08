// userApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAgents = async (page = 0, size = 10, searchString = '', agentName = '') => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get(`${API_BASE_URL}api/call/agents`, {
    params: {
      searchString,
      agentName,
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
