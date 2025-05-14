import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface MainScreenState {
  isShowComment: boolean;
  currentComment: string;
  showReply: boolean;
  comment_id: string;
  commentPrivacy: boolean;
  isShowGift: boolean;
}

const initialState: MainScreenState = {
  isShowComment: false,
  currentComment: '',
  showReply: false,
  comment_id: '',
  commentPrivacy: false,
  isShowGift: false,
};

const mainScreenSlice = createSlice({
  name: 'mainScreen',
  initialState,
  reducers: {
    setIsShowComment: (state, action: PayloadAction<boolean>) => {
      state.isShowComment = action.payload;
    },

    setCurrentComment: (state, action: PayloadAction<string>) => {
      state.currentComment = action.payload;
    },

    setShowReply: (state, action: PayloadAction<boolean>) => {
      state.showReply = action.payload;
    },

    setCommentId: (state, action: PayloadAction<string>) => {
      state.comment_id = action.payload;
    },

    setCommentPrivacy: (state, action: PayloadAction<boolean>) => {
      state.commentPrivacy = action.payload;
    },

    setIsShowGift: (state, action: PayloadAction<boolean>) => {
      state.isShowGift = action.payload;
    },
  },
});

export const {
  setIsShowComment,
  setCurrentComment,
  setShowReply,
  setCommentId,
  setCommentPrivacy,
  setIsShowGift,
} = mainScreenSlice.actions;

export default mainScreenSlice.reducer;
