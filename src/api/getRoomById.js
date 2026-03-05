import axios from "axios";

const { VITE_IS_TEST, VITE_API_URL_TEST, VITE_API_URL_PROD } =
  window.__ENV__ || {};

const isTest = VITE_IS_TEST === "true";

const baseURL = isTest ? VITE_API_URL_TEST : VITE_API_URL_PROD;

const getRoomById  = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

getRoomById.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  return config;
});

export default getRoomById;
