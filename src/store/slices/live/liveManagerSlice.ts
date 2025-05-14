import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface LiveManagerState {
  isLocalMicEnabled: boolean;
  isLocalVideoEnabled: boolean;
  activeStyleNo: number;
  noOfActiveGuest: number;
  activeStyleName: string;
}

const initialState: LiveManagerState = {
  isLocalMicEnabled: true,
  isLocalVideoEnabled: true,
  activeStyleNo: 1,
  noOfActiveGuest: 0,
  activeStyleName: 'style-1',
};

const liveManagerSlice = createSlice({
  name: 'live_manager',
  initialState,
  reducers: {
    changeLocalMicStatus(state, action: PayloadAction<boolean>) {
      state.isLocalMicEnabled = action.payload;
    },
    changeLocalCamStatus(state, action: PayloadAction<boolean>) {
      state.isLocalVideoEnabled = action.payload;
    },
    changeActiveStyleNo(state, action: PayloadAction<number>) {
      state.activeStyleNo = action.payload;
    },
    changeNoOfActiveGuest(state, action: PayloadAction<number>) {
      state.noOfActiveGuest = action.payload;
    },
    changeActiveStyleName(state, action: PayloadAction<string>) {
      state.activeStyleName = action.payload;
    },
  },
});

export const {
  changeLocalMicStatus,
  changeLocalCamStatus,
  changeActiveStyleNo,
  changeNoOfActiveGuest,
  changeActiveStyleName,
} = liveManagerSlice.actions;

export default liveManagerSlice.reducer;
