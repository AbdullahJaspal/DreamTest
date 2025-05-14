import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface PrivacySettings {
  enable_other_to_comment_on_my_post?: boolean;
  hide_location_in_profile?: boolean;
  allow_screenshot_or_screen_recording_of_my_content?: boolean;
  enable_other_to_save_my_post?: boolean;
  enable_other_to_duet_with_my_videos?: boolean;
  dont_recommened_me_to_my_friends?: boolean;
}

export interface UserPrivacyState {
  my_privacy: PrivacySettings | null;
}

const initialState: UserPrivacyState = {
  my_privacy: null,
};

const privacySlice = createSlice({
  name: 'user_privacy',
  initialState,
  reducers: {
    setMyPrivacy(
      state,
      action: PayloadAction<{index: number; value: boolean} | PrivacySettings>,
    ) {
      if (!state.my_privacy) {
        state.my_privacy = {};
      }

      if ('index' in action.payload && 'value' in action.payload) {
        const {index, value} = action.payload;
        switch (index) {
          case 0:
            state.my_privacy.hide_location_in_profile = value;
            break;
          case 1:
            state.my_privacy.dont_recommened_me_to_my_friends = value;
            break;
          case 3:
            state.my_privacy.enable_other_to_duet_with_my_videos = value;
            break;
          case 4:
            state.my_privacy.enable_other_to_save_my_post = value;
            break;
          case 5:
            state.my_privacy.enable_other_to_comment_on_my_post = value;
            break;
          case 6:
            state.my_privacy.allow_screenshot_or_screen_recording_of_my_content =
              value;
            break;
        }
      } else {
        state.my_privacy = {
          ...state.my_privacy,
          ...action.payload,
        };
      }
    },
  },
});

export const {setMyPrivacy} = privacySlice.actions;

export default privacySlice.reducer;
