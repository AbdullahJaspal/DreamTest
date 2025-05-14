import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface PostDataState {
  progreess_value: number;
  show_uploading_info: boolean;
}

const initialState: PostDataState = {
  progreess_value: 0,
  show_uploading_info: false,
};

const postDataSlice = createSlice({
  name: 'post_data',
  initialState,
  reducers: {
    addPostProgressData(state, action: PayloadAction<number>) {
      state.progreess_value = action.payload;
    },
    setShowUploadingInfo(state, action: PayloadAction<boolean>) {
      state.show_uploading_info = action.payload;
    },
  },
});

export const {addPostProgressData, setShowUploadingInfo} =
  postDataSlice.actions;

export default postDataSlice.reducer;
