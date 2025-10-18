import axios from "axios";

const api = axios.create();

export const setApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    api.defaults.baseURL = window.location.origin;
  }
};

export default api;
