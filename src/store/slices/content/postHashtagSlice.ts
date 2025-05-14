import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface PostHashtagState {
  Hashtag_title: string | null;
}

const initialState: PostHashtagState = {
  Hashtag_title: null,
};

const postHashtagSlice = createSlice({
  name: 'Hashtag',
  initialState,
  reducers: {
    addhashtag(state, action: PayloadAction<string>) {
      state.Hashtag_title = action.payload;
    },
    removehashtag(state) {
      state.Hashtag_title = null;
    },
  },
});

export const {addhashtag, removehashtag} = postHashtagSlice.actions;

export default postHashtagSlice.reducer;
