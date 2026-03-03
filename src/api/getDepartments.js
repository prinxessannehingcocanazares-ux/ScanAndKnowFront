import axios from "axios";

const { VITE_IS_TEST, VITE_API_URL_TEST, VITE_API_URL_PROD } =
  window.__ENV__ || {};

const isTest = VITE_IS_TEST === "true";

const baseURL = isTest
  ? VITE_API_URL_TEST
  : VITE_API_URL_PROD;

const getDepartments = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

getDepartments.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log("inside getDepartments api Request URL:", fullUrl);
  return config;
});



export default getDepartments;