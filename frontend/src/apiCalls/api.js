import axios from 'axios';
// import { store } from '../redux/store';
//import { logout } from './redux/actions/authActions';

const api = axios.create({
  baseURL: 'http://localhost:5001',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
      toast.error('You are not logged in. Please log in to continue.');
    } else if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong'}`);
    } else {
      toast.error('Error: Network Error');
    }
    return Promise.reject(error);
  }
);

export default api;
