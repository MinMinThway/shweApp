// src/api/exchangeRateApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchExchangeRates = async (startDate, endDate, page = 0, size = 10) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get(
    `${API_BASE_URL}api/v1/exchange-rates/filter?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/**
 * Create a new exchange rate
 * @param {Object} payload - Exchange rate object: { date, time, buyMmk, sellMmk }
 */
export const createExchangeRate = async (payload) => {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post(`${API_BASE_URL}api/v1/exchange-rates`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};
