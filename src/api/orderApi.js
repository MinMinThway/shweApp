// src/api/orderApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchOrders = async (page = 0, size = 10, search = '', status = 'PENDING') => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get(
    `${API_BASE_URL}api/v1/order/paginated?page=${page}&size=${size}&search=${search}&status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data || [];
};
