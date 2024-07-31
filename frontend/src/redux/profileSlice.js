import { createSlice } from '@reduxjs/toolkit';
import profileImage from '../metadata/pictures/profile_pic.jpg'

const initialState = {
  user: {
    id: null,
    name: '',
    bio: '',
    profile_pic_url: '',
    number_of_followers: 0,
    number_of_posts: 0,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload.userDetails };
    },
    decreaseFollowingCount: (state) => {
      state.user.number_of_followers -= 1;
    },
    increaseFollowingCount: (state) => {
      state.user.number_of_followers += 1;
    }
  },
});

export const { updateProfile, decreaseFollowingCount, increaseFollowingCount } = profileSlice.actions;

export default profileSlice.reducer;
