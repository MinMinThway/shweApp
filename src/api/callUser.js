import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
});

/**
 * Fetch paginated call center users with optional search.
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @param {string} search - Search query
 */
export const fetchCallCenterUsers = async (page = 0, size = 10, search = '') => {
  const response = await axios.get(`${API_BASE_URL}api/call/users`, {
    params: { search, page, size },
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * Create a new call center user
 * @param {Object} payload - { userId, phoneNumber }
 */
export const createCallCenterUser = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}api/call/create/User`, payload, { headers: getAuthHeader() });
  return response.data;
};

/**
 * Get single call center user by userId
 * @param {number} userId
 */
export const getCallCenterUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}api/call/user/${userId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

/**
 * Update call center user
 * @param {number} userId
 * @param {Object} payload - { phoneNumber, serviceStatus, remainingBalance }
 */
export const updateCallCenterUser = async (userId, payload) => {
  const response = await axios.put(`${API_BASE_URL}api/call/user/${userId}`, payload, { headers: getAuthHeader() });
  return response.data;
};

/**
 * Delete call center user
 * @param {number} userId
 */
export const deleteCallCenterUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}api/call/user/${userId}`, {
    headers: getAuthHeader()
  });
  return response.status === 204;
};
