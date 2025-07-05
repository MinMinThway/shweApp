import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
});

/**
 * Fetch exchange rates with filters
 */
export const fetchExchangeRates = async (startDate, endDate, page = 0, size = 10) => {
  const response = await axios.get(
    `${API_BASE_URL}api/v1/exchange-rates/filter?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`,
    {
      headers: getAuthHeader()
    }
  );
  return response.data;
};

/**
 * Create a new exchange rate
 * @param {Object} payload - { date, time, buyMmk, sellMmk }
 */
export const createExchangeRate = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}api/v1/exchange-rates`, payload, {
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * Update an existing exchange rate
 * @param {number} id - Exchange rate ID
 * @param {Object} payload - { date, time, buyMmk, sellMmk }
 */
export const updateExchangeRate = async (id, payload) => {
  const response = await axios.put(`${API_BASE_URL}api/v1/exchange-rates/${id}`, payload, {
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * Delete an exchange rate by ID
 * @param {number} id - Exchange rate ID
 */
export const deleteExchangeRate = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}api/v1/exchange-rates/${id}`, {
    headers: getAuthHeader()
  });
  return response.status === 204; // true if successfully deleted
};
