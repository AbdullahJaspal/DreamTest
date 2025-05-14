import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface BoxGiftState {
  show_box_gift: boolean;
}

const initialState: BoxGiftState = {
  show_box_gift: false,
};

const boxGiftSlice = createSlice({
  name: 'box_gift',
  initialState,
  reducers: {
    changeShowBoxGift(state, action: PayloadAction<boolean>) {
      state.show_box_gift = action.payload;
    },
  },
});

export const {changeShowBoxGift} = boxGiftSlice.actions;

export default boxGiftSlice.reducer;
