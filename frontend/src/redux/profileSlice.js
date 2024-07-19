import { createSlice } from '@reduxjs/toolkit';
import profileImage from '../metadata/pictures/profile_pic.jpg'

const initialState = {
  user: {
    name: 'John Doe',
    bio: 'This is a sample bio',
    profilePicture: profileImage,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
