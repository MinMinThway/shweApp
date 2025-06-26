import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return { Authorization: `Bearer ${token}` };
};

export const fetchAgents = async (page = 0, size = 10, search = '', name = '') => {
  const response = await axios.get(`${API_BASE_URL}api/call/agents`, {
    params: { search, name, page, size },
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAgentById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}api/call/get/Agent/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createAgent = async (agentData) => {
    console.log(agentData);
  const response = await axios.post(`${API_BASE_URL}api/call/create/Agent`, agentData, {
    headers: getAuthHeader()
  });
  console.log(response);
  return response.data;
};

export const updateAgent = async (id, agentData) => {
  const response = await axios.put(`${API_BASE_URL}api/call/update/Agent/${id}`, agentData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteAgent = async (id) => {
  console.log(id);
  const response = await axios.delete(`${API_BASE_URL}api/call/delete/Agent/${11}`, {
    headers: getAuthHeader()
  });
  return response.status === 204; // Returns true if deletion was successful
};
