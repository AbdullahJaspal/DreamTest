import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface HashtagState {
  hashtagTitle: string | null;
}

const initialState: HashtagState = {
  hashtagTitle: null,
};

const hashtagSlice = createSlice({
  name: 'hashtag',
  initialState,
  reducers: {
    setHashtag: (state, action: PayloadAction<string>) => {
      state.hashtagTitle = action.payload;
    },

    clearHashtag: state => {
      state.hashtagTitle = null;
    },
  },
});

export const {setHashtag, clearHashtag} = hashtagSlice.actions;

export default hashtagSlice.reducer;
