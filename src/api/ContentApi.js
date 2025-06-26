// src/api/ContentApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';
const token = localStorage.getItem('accessToken');

const headers = {
  Authorization: `Bearer ${token}`
};

// Create content (with images)
export const createContent = async (formDataObj) => {
  const formData = new FormData();

  formData.append('title', formDataObj.title);
  formData.append('body', formDataObj.body);
  formData.append('contentType', formDataObj.contentType);

  if (formDataObj.imageFiles && formDataObj.imageFiles.length > 0) {
    formDataObj.imageFiles.forEach((file) => {
      formData.append('imageFiles', file);
    });
  }

  const response = await axios.post(`${API_BASE_URL}api/contents/create`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// Fetch contents with filtering
export const fetchContents = async (contentType = 'INF', searchString = '', page = 0, size = 5) => {
  const response = await axios.get(`${API_BASE_URL}api/contents/filter-content`, {
    params: {
      contentType,
      searchString,
      page,
      size
    },
    headers
  });

  return response.data || [];
};

// Get content by id
export const getContentById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}api/contents/${id}`, {
    headers
  });
  return response.data;
};

// Update content by id (with images)
export const updateContent = async (id, formDataObj) => {
  const formData = new FormData();

  if (formDataObj.title !== undefined) formData.append('title', formDataObj.title);
  if (formDataObj.body !== undefined) formData.append('body', formDataObj.body);
  if (formDataObj.contentType !== undefined) formData.append('contentType', formDataObj.contentType);

  if (formDataObj.imageFiles && formDataObj.imageFiles.length > 0) {
    formDataObj.imageFiles.forEach((file) => {
      formData.append('imageFiles', file);
    });
  }

  const response = await axios.put(`${API_BASE_URL}api/contents/update/${id}`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// Delete content by id
export const deleteContent = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}api/contents/delete/${id}`, {
    headers
  });
  return response.status === 204; // no content means success
};
