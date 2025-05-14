import {combineReducers} from '@reduxjs/toolkit';

// UI Slices
import boxGiftSlice from './slices/ui/boxGiftSlice';
import indexSlice from './slices/ui/indexSlice';
import mainScreenSlice from './slices/ui/mainScreenSlice';
import favoriteHashtagsSlice from './slices/ui/favoriteHashtagsSlice';
import themeColorReducer from './slices/ui/themeSlice';
import fontReduces from './slices/ui/fontSlice';

// User Slices
import my_dataSlice from './slices/user/my_dataSlice';
import followDetailsReducer from './slices/user/followDetailsSlice';
import userPrivacyReducer from './slices/user/privacySlice';

// Content Slices
import videoSlice from './slices/content/videoSlice';
import pictureSlice from './slices/content/pictureSlice';
import externalSoundSlice from './slices/content/externalSoundSlice';
import postHashtagSlice from './slices/content/postHashtagSlice';
import postDataSlice from './slices/content/postSlice';
import messagesReducer from './slices/content/messageSlice';

// Live Streaming Slices
import liveManagerSlice from './slices/live/liveManagerSlice';
import liveMultiButtonSlice from './slices/live/liveMultiButtonSlice';
import liveSettingSlice from './slices/live/liveSettingsSlice';
import liveViewersSlice from './slices/live/liveViewersSlice';

// Common Slices
import socketReducer from './slices/common/socketSlice';
import notificationSlice from './slices/common/notificationSlice';
import locationSelectionSlice from './slices/common/locationSlice';
import searchSlice from './slices/common/searchSlice';

export const rootReducer = {
  // UI related reducers
  box_gift: boxGiftSlice,
  index: indexSlice,
  mainScreen: mainScreenSlice,
  favoriteHashtags: favoriteHashtagsSlice,
  themeColor: themeColorReducer,

  // User related reducers
  my_data: my_dataSlice,
  followDetails: followDetailsReducer,
  user_privacy: userPrivacyReducer,

  // Content related reducers
  video: videoSlice,
  picture_post: pictureSlice,
  externalaudio_url: externalSoundSlice,
  Hashtag: postHashtagSlice,
  post_data: postDataSlice,

  // Live streaming related reducers
  live_manager: liveManagerSlice,
  live_multi_button: liveMultiButtonSlice,
  live_settings: liveSettingSlice,
  live_viewers_manager: liveViewersSlice,

  // Common functionality reducers
  socket: socketReducer,
  notification: notificationSlice,
  location_selection: locationSelectionSlice,
  search: searchSlice,
  messages: messagesReducer,
  fonts: fontReduces,
};

// Export a combined reducer (optional, if you want to use it elsewhere)
export const combinedRootReducer = combineReducers(rootReducer);

// You might also want to export a type for the state shape
export type RootReducerState = ReturnType<typeof combinedRootReducer>;
