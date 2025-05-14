import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface FollowDetailsState {
  following: any[];
  followers: any[];
}

const initialState: FollowDetailsState = {
  followers: [],
  following: [],
};

const followDetailsSlice = createSlice({
  name: 'followDetails',
  initialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<string[]>) => {
      state.followers = action.payload;
    },

    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
    },

    addFollower: (state, action: PayloadAction<string>) => {
      state.followers.push(action.payload);
    },

    removeFollower: (state, action: PayloadAction<string>) => {
      state.followers = state.followers.filter(
        follower => follower !== action.payload,
      );
    },

    addFollowing: (state, action: PayloadAction<string>) => {
      state.following.push(action.payload);
    },

    removeFollowing: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter(
        following => following !== action.payload,
      );
    },
  },
});

export const {
  setFollowers,
  setFollowing,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
} = followDetailsSlice.actions;

export default followDetailsSlice.reducer;
