import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserProfile} from '../../../types/UserProfileData';

export interface UserProfileState {
  my_profile_data: UserProfile;
  isLogin: boolean;
  bottomTabHeight: number;
  bottomSectionHeight: number;
}

const initialState: UserProfileState = {
  my_profile_data: {
    wallet: 0,
  },
  isLogin: false,
  bottomTabHeight: 0,
  bottomSectionHeight: 0,
};

const my_dataSlice = createSlice({
  name: 'my_data',
  initialState,
  reducers: {
    add_my_profile_data(state, action: PayloadAction<UserProfile>) {
      state.my_profile_data = action.payload;
    },

    addIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },

    update_wallet_diamond(state, action: PayloadAction<number>) {
      state.my_profile_data.wallet = action.payload;
    },

    update_nickname(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.nickname = action.payload;
    },

    update_gender(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.gender = action.payload;
    },

    update_bio(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.bio = action.payload;
    },

    update_website(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.website = action.payload;
    },

    update_dob(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.dob = action.payload;
    },

    update_profile_pic(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.profile_pic = action.payload;
    },

    update_lat(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.lat = action.payload;
    },

    update_lang(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.lang = action.payload;
    },

    update_online(state, action: PayloadAction<boolean | undefined>) {
      state.my_profile_data.online = action.payload;
    },

    update_verified(state, action: PayloadAction<boolean | undefined>) {
      state.my_profile_data.verified = action.payload;
    },

    update_city(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.city = action.payload;
    },

    update_country(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.country = action.payload;
    },

    update_fb_id(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.fb_id = action.payload;
    },

    update_emotion_state(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.emotion_state = action.payload;
    },

    update_making_friend_intention(
      state,
      action: PayloadAction<string | undefined>,
    ) {
      state.my_profile_data.making_friend_intention = action.payload;
    },

    update_hobbies(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.hobbies = action.payload;
    },

    update_person_height(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.person_height = action.payload;
    },

    update_person_weight(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.person_weight = action.payload;
    },

    update_instagram(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.instagram = action.payload;
    },

    update_you_tube(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.you_tube = action.payload;
    },

    update_facebook(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.facebook = action.payload;
    },

    update_occupation(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.occupation = action.payload;
    },

    update_profile_video(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.profile_video = action.payload;
    },

    update_twitter(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.twitter = action.payload;
    },

    update_username(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.username = action.payload;
    },

    update_language(state, action: PayloadAction<string | undefined>) {
      state.my_profile_data.language = action.payload;
    },

    changeBottomTabHeight(state, action: PayloadAction<number>) {
      state.bottomTabHeight = action.payload;
    },

    changeBottomSectionHeight(state, action: PayloadAction<number>) {
      state.bottomSectionHeight = action.payload;
    },
  },
});

export const {
  add_my_profile_data,
  addIsLogin,
  update_wallet_diamond,
  update_nickname,
  update_gender,
  update_bio,
  update_website,
  update_dob,
  update_profile_pic,
  update_lat,
  update_lang,
  update_online,
  update_verified,
  update_city,
  update_country,
  update_fb_id,
  update_emotion_state,
  update_making_friend_intention,
  update_hobbies,
  update_person_height,
  update_person_weight,
  update_instagram,
  update_you_tube,
  update_facebook,
  update_occupation,
  update_profile_video,
  update_twitter,
  update_username,
  changeBottomTabHeight,
  changeBottomSectionHeight,
  update_language,
} = my_dataSlice.actions;

// Export reducer
export default my_dataSlice.reducer;
