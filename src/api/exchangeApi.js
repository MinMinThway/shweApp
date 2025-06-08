// src/api/exchangeRateApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchExchangeRates = async (
  startDate,
  endDate,
  page = 0,
  size = 10
) => {
  const token = localStorage.getItem("accessToken");

  const response = await axios.get(
    `${API_BASE_URL}api/v1/exchange-rates/filter?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
