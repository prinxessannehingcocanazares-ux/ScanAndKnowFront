import axios from "axios";

const { VITE_IS_TEST, VITE_API_URL_TEST, VITE_API_URL_PROD } =
  window.__ENV__ || {};

const isTest = VITE_IS_TEST === "true";

const baseURL = isTest ? VITE_API_URL_TEST : VITE_API_URL_PROD;

const deleteScheduleById = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

deleteScheduleById.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  return config;
});

export default deleteScheduleById;
