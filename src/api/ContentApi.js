// src/api/ContentApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';
const token = localStorage.getItem('accessToken');

const headers = {
  Authorization: `Bearer ${token}`,
};

export const fetchContents = async (contentType = 'INF', searchString = '', page = 0, size = 10) => {
  const response = await axios.get(`${API_BASE_URL}api/contents/filter-content`, {
    params: {
      contentType,
      searchString,
      page,
      size,
    },
    headers,
  });

  return response.data.content || [];
};
