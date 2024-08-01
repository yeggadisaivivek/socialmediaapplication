import api from './api';
import  { toast } from 'react-toastify';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    const userId = response.data.userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch all posts
export const fetchAllPosts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts/all-posts`);
    return response.data.body;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add a new post
export const addPost = async (userId, postData) => {
  try {
    const response = await api.post(`/users/${userId}/posts`, postData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Edit a post
export const deletePost = async (userId, postId) => {
  try {
    const response = await api.delete(`/users/${userId}/posts/${postId}`);;
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch UserDetails for Bio page
export const fetchUserDetails = async (userId, followerId) => {
  try {
    const response = await api.get(`/users/${userId}/userData`, {
      params: {
        followerId
      }
    });
    return response.data.body;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update User Details in Userdata
export const updateUserDetails = async (userId, bio, profilePicKey) => {
  try {
    const response = await api.put(`/users/${userId}/userData`, {
      bio,
      profilePicKey,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Like the post
export const likeOrUnlikePost = async (userId, postId, likeUnlike) => {
  try {
    const response = await api.post(`/users/${userId}/posts/${postId}/likes`, { action: likeUnlike });
    return response.data?.message;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const followUser = async (userId, followerId) => {
  try {
    const response = await api.put(`/users/${userId}/follower/follow/${followerId}`)
    return response;
  } catch (error) {
    handleApiError(error)
  }
}

export const unfollowUser = async (userId, followerId) => {
  try {
    const response = await api.put(`/users/${userId}/follower/unfollow/${followerId}`)
    return response;
  } catch (error) {
    handleApiError(error)
  }
}

export const fetchPostsOfUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.body;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Add comment
export const addComment = async (userId, postId, comment) => {
  try {
    const response = await api.post(`/users/${userId}/posts/${postId}/comments`, comment);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// To upload image/video to s3 bucket
export const getPreSignedURL = async ( filename, contentType) => {
  try{
    const response = await api.get('/generate-presigned-put-url', {
      params: {
        filename,
        contentType,
      },
    });
    return response.data;
  } catch ( error ) {
    console.error(error);
    throw error;
  }
}

// Fetch all the users in the applicatiion
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.body
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data.message || error.response.statusText);
    toast.error(error.response.data.message || 'An error occurred. Please try again.');
  } else if (error.request) {
    console.error('API Error: No response received from the server.');
    toast.error('No response received from the server. Please try again.');
  } else {
    console.error('API Error:', error.message);
    toast.error('An error occurred. Please try again.');
  }
  throw error;
};
