// src/apiCalls.js
import api from './api';
// import { store } from './redux/store';
// import { loginSuccess, logout } from './redux/slices/authSlice';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    console.log("token:::"+token)
    localStorage.setItem('token', token);
    //store.dispatch(loginSuccess(token));
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch all posts
export const fetchAllPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Add a new post
export const addPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Edit a post
export const editPost = async (slug, postData) => {
  try {
    const response = await api.put(`/posts/${slug}`, postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data.message || error.response.statusText);
    alert(error.response.data.message || 'An error occurred. Please try again.');
  } else if (error.request) {
    console.error('API Error: No response received from the server.');
    alert('No response received from the server. Please try again.');
  } else {
    console.error('API Error:', error.message);
    alert('An error occurred. Please try again.');
  }
  throw error;
};
