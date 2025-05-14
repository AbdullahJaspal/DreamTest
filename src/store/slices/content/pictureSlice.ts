import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  PicturePost,
  PicturePostComment,
} from '../../../screens/picture_feed/types/picturePost';

export interface PictureFeedState {
  postData?: PicturePost | null;
  showMoreOptions: boolean;
  selectedCommentData?: PicturePostComment | null;
  enableEditComment: boolean;
  currentCommentUserIds: number;
  totalNoOfComment: number;
  sharePostRootId: number;
  blockedUserIds: number[];
  hiddenPostIds: number[];
  removePostIds: number[];
  favoritesPostCount: number;
  showReportModal: boolean;
  favoritePosts: PicturePost[];
  favoritePostSocket: PicturePost[];
}

const initialState: PictureFeedState = {
  postData: null,
  showMoreOptions: false,
  selectedCommentData: null,
  enableEditComment: false,
  currentCommentUserIds: -1,
  totalNoOfComment: 0,
  sharePostRootId: 0,
  blockedUserIds: [],
  hiddenPostIds: [],
  removePostIds: [],
  showReportModal: false,
  favoritePosts: [],
  favoritePostSocket: [],
  favoritesPostCount: 0,
};

const picturePostSlice = createSlice({
  name: 'picture_post',
  initialState,
  reducers: {
    setPostData(state, action: PayloadAction<PicturePost | null>) {
      state.postData = action.payload;
    },

    toggleShowMoreOptions(state) {
      state.showMoreOptions = !state.showMoreOptions;
    },

    resetPostData(state) {
      state.postData = null;
      state.showMoreOptions = false;
    },

    setPostComment(state, action: PayloadAction<PicturePostComment | null>) {
      state.selectedCommentData = action.payload;
    },

    setEnableEdit(state, action: PayloadAction<boolean>) {
      state.enableEditComment = action.payload;
    },

    setCurrentCommentUserIds(state, action: PayloadAction<number>) {
      state.currentCommentUserIds = action.payload;
    },

    setTotalNoOfComment(state, action: PayloadAction<number>) {
      state.totalNoOfComment = action.payload;
    },

    increaseTotalNoOfComment(state) {
      state.totalNoOfComment++;
    },

    descreaseTotalNoOfComment(state) {
      state.totalNoOfComment--;
    },

    setSharePostRootId(state, action: PayloadAction<number>) {
      state.sharePostRootId = action.payload;
    },

    addBlockedUserId(state, action: PayloadAction<number>) {
      if (!state.blockedUserIds.includes(action.payload)) {
        state.blockedUserIds.push(action.payload);
      }
    },

    removeBlockedUserId(state, action: PayloadAction<number>) {
      state.blockedUserIds = state.blockedUserIds.filter(
        id => id !== action.payload,
      );
    },

    hidePost(state, action: PayloadAction<number>) {
      if (!state.hiddenPostIds.includes(action.payload)) {
        state.hiddenPostIds.push(action.payload);
      }
    },

    unhidePost(state, action: PayloadAction<number>) {
      state.hiddenPostIds = state.hiddenPostIds.filter(
        id => id !== action.payload,
      );
    },

    removePost(state, action: PayloadAction<number>) {
      if (!state.removePostIds.includes(action.payload)) {
        state.removePostIds.push(action.payload);
      }
    },

    addToFavorites(state, action: PayloadAction<PicturePost>) {
      const exists = state.favoritePosts.some(
        post => post.id === action.payload.id,
      );
      if (!exists) {
        state.favoritePosts.push(action.payload);
      }
    },

    setFavouritePosts: (state, action: PayloadAction<PicturePost>) => {
      const exists = state.favoritePostSocket.some(
        post => post.id === action.payload.id,
      );
      if (!exists) {
        state.favoritePostSocket.push(action.payload);
      }
    },

    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favoritePosts = state.favoritePosts.filter(
        post => post.id !== action.payload,
      );
    },

    setShowReportModal: (state, action: PayloadAction<boolean>) => {
      state.showReportModal = action.payload;
    },

    decrementFavoritesPostCount: state => {
      state.favoritesPostCount -= 1;
    },
  },
});

export const {
  setPostData,
  toggleShowMoreOptions,
  resetPostData,
  setPostComment,
  setEnableEdit,
  setCurrentCommentUserIds,
  setTotalNoOfComment,
  increaseTotalNoOfComment,
  descreaseTotalNoOfComment,
  setSharePostRootId,
  addBlockedUserId,
  removeBlockedUserId,
  hidePost,
  unhidePost,
  removePost,
  addToFavorites,
  setFavouritePosts,
  removeFromFavorites,
  setShowReportModal,
  decrementFavoritesPostCount,
} = picturePostSlice.actions;

export default picturePostSlice.reducer;
