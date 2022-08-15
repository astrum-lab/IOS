import axios from "axios";

const api = axios.create({
  baseURL: "https://api.astrocoin.uz/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const api2 = axios.create({
  baseURL: "https://api.astrocoin.uz/api/",
});

export default api;
