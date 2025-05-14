import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ViewerRole = 'VIEWER' | 'HOST' | 'GUEST' | 'ADMIN';

export interface LiveViewersManagerState {
  role: ViewerRole;
  isLocalVideoEnabled: boolean;
  activeStyleNo: number;
  noOfActiveGuest: number;
  activeStyleName: string;
}

const initialState: LiveViewersManagerState = {
  role: 'VIEWER',
  isLocalVideoEnabled: true,
  activeStyleNo: 3,
  noOfActiveGuest: 0,
  activeStyleName: 'style-1',
};

const liveViewersManagerSlice = createSlice({
  name: 'live_viewers_manager',
  initialState,
  reducers: {
    changeRole: (state, action: PayloadAction<ViewerRole>) => {
      state.role = action.payload;
    },
    changeLocalCamStatus: (state, action: PayloadAction<boolean>) => {
      state.isLocalVideoEnabled = action.payload;
    },
    changeActiveStyleNo: (state, action: PayloadAction<number>) => {
      state.activeStyleNo = action.payload;
    },
    changeNoOfActiveGuest: (state, action: PayloadAction<number>) => {
      state.noOfActiveGuest = action.payload;
    },
    changeActiveStyleName: (state, action: PayloadAction<string>) => {
      state.activeStyleName = action.payload;
    },
  },
});

export const {
  changeRole,
  changeNoOfActiveGuest,
  changeLocalCamStatus,
  changeActiveStyleName,
  changeActiveStyleNo,
} = liveViewersManagerSlice.actions;

export default liveViewersManagerSlice.reducer;
