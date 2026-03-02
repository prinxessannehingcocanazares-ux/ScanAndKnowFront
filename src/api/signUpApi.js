import axios from "axios";

const { VITE_IS_TEST, VITE_API_URL_TEST, VITE_API_URL_PROD } =
  window.__ENV__ || {};

const isTest = VITE_IS_TEST === "true";

console.log("isTest: ", isTest);

const baseURL = isTest
  ? VITE_API_URL_TEST
  : VITE_API_URL_PROD;

const signUpApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// signUpApi.interceptors.request.use((config) => {
//   const fullUrl = `${config.baseURL}${config.url}`;
//   console.log("inside api Request URL:", fullUrl);
//   return config;
// });



export default signUpApi;