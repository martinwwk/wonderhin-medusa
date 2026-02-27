import axios from 'axios';
import Cookies from 'js-cookie';

const getToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get('auth_token');
};

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  // baseURL: typeof window !== 'undefined'
  //   ? `${window.location.origin}/api`
  //   : (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api'),
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Set up an interceptor for the request to add the Authorization header
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers.Authorization = `wiki ${token ? token : ''}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
