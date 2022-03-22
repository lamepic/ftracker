import axios from "axios";

export const auth_axios = axios.create({
  baseURL: process.env.REACT_APP_PROD_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const instance = axios.create({
  baseURL: process.env.REACT_APP_PROD_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
