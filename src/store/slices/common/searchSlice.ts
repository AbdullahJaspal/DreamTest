import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SearchState {
  txtSearch: string;
}

const initialState: SearchState = {
  txtSearch: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTxtSearch: (state, action: PayloadAction<string>) => {
      state.txtSearch = action.payload;
    },
  },
});

export const {setTxtSearch} = searchSlice.actions;

export default searchSlice.reducer;
