import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface HashtagData {
  num_of_video: number;
  tag_id: number;
  title: string;
}

export interface FavoriteHashtagsState {
  hashtags: HashtagData[];
}

const initialState: FavoriteHashtagsState = {
  hashtags: [],
};

const favoriteHashtagsSlice = createSlice({
  name: 'favoriteHashtags',
  initialState,
  reducers: {
    setFavoriteHashtags: (state, action: PayloadAction<HashtagData[]>) => {
      state.hashtags = action.payload;
    },
    addFavoriteHashtag: (state, action: PayloadAction<HashtagData>) => {
      state.hashtags.push(action.payload);
    },
    removeFavoriteHashtag: (state, action: PayloadAction<number>) => {
      state.hashtags = state.hashtags.filter(h => h.tag_id !== action.payload);
    },
  },
});

export const {setFavoriteHashtags, addFavoriteHashtag, removeFavoriteHashtag} =
  favoriteHashtagsSlice.actions;

export default favoriteHashtagsSlice.reducer;
