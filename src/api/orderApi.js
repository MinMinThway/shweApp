import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('accessToken');

export const fetchOrders = async (page = 0, size = 10, search = '', status = 'PENDING') => {
  const response = await axios.get(`${API_BASE_URL}api/v1/order/paginated?page=${page}&size=${size}&search=${search}&status=${status}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data || [];
};

export const fetchOrderById = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}api/v1/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Missing export: deleteOrderById
export const deleteOrderById = async (orderId) => {
  const response = await axios.delete(`${API_BASE_URL}api/v1/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Missing export: updateOrderStatus
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await axios.put(
    `${API_BASE_URL}api/v1/order/update/${orderId}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
export const finishOrder = async (orderId, newNinetyDaysReportImage) => {
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('newNinetyDaysReportImage', newNinetyDaysReportImage);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/finish`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const finishOrderED = async (orderId, newNinetyDaysReportImage) => {
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('eVisaUrl', newNinetyDaysReportImage);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/finish-edvisa`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
// Finish DTV Visa Order
export const finishOrderDTVVisa = async (orderId, eVisaUrl) => {
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('eVisaUrl', eVisaUrl);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/finish-dtvvisa`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Finish Embassy Letter Order
export const finishOrderEmbassyLetter = async (orderId, embassyLetterUrl) => {
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('embassyLetterUrl', embassyLetterUrl);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/finish-embassy-letter`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const finishCiVisa = async (orderId, embassyLetterUrl) => {
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('approvalFile', embassyLetterUrl);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/finish-ci-visa`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Mark order as incomplete/uncompleted
export const markOrderAsIncomplete = async (orderId, rejectNotes) => {
  const params = new URLSearchParams();
  params.append('orderId', orderId);
  params.append('rejectNotes', rejectNotes);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/uncomplete`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

// Confirm order
export const confirmOrder = async (orderId) => {
  const params = new URLSearchParams();
  params.append('orderId', orderId);

  const response = await axios.post(`${API_BASE_URL}api/v1/order/confirm`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};
