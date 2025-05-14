import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FollowState {
  following: string[];
  followers: string[];
}

const initialState: FollowState = {
  followers: [],
  following: [],
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<string[]>) => {
      state.followers = action.payload;
    },

    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
    },

    addFollower: (state, action: PayloadAction<string>) => {
      if (!state.followers.includes(action.payload)) {
        state.followers.push(action.payload);
      }
    },

    removeFollower: (state, action: PayloadAction<string>) => {
      state.followers = state.followers.filter(
        follower => follower !== action.payload,
      );
    },

    addFollowing: (state, action: PayloadAction<string>) => {
      if (!state.following.includes(action.payload)) {
        state.following.push(action.payload);
      }
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
} = followSlice.actions;

export default followSlice.reducer;
