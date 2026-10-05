import axios from 'axios'

// Create the axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
    (response) => response,
  
    async (error) => {
      if (error.response?.status === 401) {
        // handle unauthorized
        // مثلا logout / refresh token
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance