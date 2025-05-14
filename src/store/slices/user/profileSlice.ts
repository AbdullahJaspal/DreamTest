import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserProfile} from '../../types';

interface ProfileState {
  profileData: UserProfile;
  isLoggedIn: boolean;
  bottomTabHeight: number;
  bottomSectionHeight: number;
}

const initialState: ProfileState = {
  profileData: {
    wallet: 0,
  },
  isLoggedIn: false,
  bottomTabHeight: 0,
  bottomSectionHeight: 0,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData(state, action: PayloadAction<UserProfile>) {
      state.profileData = action.payload;
    },

    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },

    updateWallet(state, action: PayloadAction<number>) {
      state.profileData.wallet = action.payload;
    },

    updateNickname(state, action: PayloadAction<string>) {
      state.profileData.nickname = action.payload;
    },

    updateGender(state, action: PayloadAction<string>) {
      state.profileData.gender = action.payload;
    },

    updateBio(state, action: PayloadAction<string>) {
      state.profileData.bio = action.payload;
    },

    updateWebsite(state, action: PayloadAction<string>) {
      state.profileData.website = action.payload;
    },

    updateDob(state, action: PayloadAction<string>) {
      state.profileData.dob = action.payload;
    },

    updateProfilePic(state, action: PayloadAction<string>) {
      state.profileData.profile_pic = action.payload;
    },

    updateLocation(
      state,
      action: PayloadAction<{lat?: number; lang?: number}>,
    ) {
      if (action.payload.lat !== undefined) {
        state.profileData.lat = action.payload.lat;
      }
      if (action.payload.lang !== undefined) {
        state.profileData.lang = action.payload.lang;
      }
    },

    updateOnlineStatus(state, action: PayloadAction<boolean>) {
      state.profileData.online = action.payload;
    },

    updateVerified(state, action: PayloadAction<boolean>) {
      state.profileData.verified = action.payload;
    },

    updateAddress(
      state,
      action: PayloadAction<{city?: string; country?: string}>,
    ) {
      if (action.payload.city !== undefined) {
        state.profileData.city = action.payload.city;
      }
      if (action.payload.country !== undefined) {
        state.profileData.country = action.payload.country;
      }
    },

    updateSocialIds(
      state,
      action: PayloadAction<{
        fb_id?: string;
        instagram?: string;
        youtube?: string;
        facebook?: string;
        twitter?: string;
      }>,
    ) {
      const {fb_id, instagram, youtube, facebook, twitter} = action.payload;

      if (fb_id !== undefined) state.profileData.fb_id = fb_id;
      if (instagram !== undefined) state.profileData.instagram = instagram;
      if (youtube !== undefined) state.profileData.you_tube = youtube;
      if (facebook !== undefined) state.profileData.facebook = facebook;
      if (twitter !== undefined) state.profileData.twitter = twitter;
    },

    updatePersonalInfo(
      state,
      action: PayloadAction<{
        emotion_state?: string;
        making_friend_intention?: string;
        hobbies?: string[];
        person_height?: number;
        person_weight?: number;
        occupation?: string;
        username?: string;
        language?: string[];
      }>,
    ) {
      const {
        emotion_state,
        making_friend_intention,
        hobbies,
        person_height,
        person_weight,
        occupation,
        username,
        language,
      } = action.payload;

      if (emotion_state !== undefined)
        state.profileData.emotion_state = emotion_state;
      if (making_friend_intention !== undefined)
        state.profileData.making_friend_intention = making_friend_intention;
      if (hobbies !== undefined) state.profileData.hobbies = hobbies;
      if (person_height !== undefined)
        state.profileData.person_height = person_height;
      if (person_weight !== undefined)
        state.profileData.person_weight = person_weight;
      if (occupation !== undefined) state.profileData.occupation = occupation;
      if (username !== undefined) state.profileData.username = username;
      if (language !== undefined) state.profileData.language = language;
    },

    updateProfileVideo(state, action: PayloadAction<string>) {
      state.profileData.profile_video = action.payload;
    },

    setBottomTabHeight(state, action: PayloadAction<number>) {
      state.bottomTabHeight = action.payload;
    },

    setBottomSectionHeight(state, action: PayloadAction<number>) {
      state.bottomSectionHeight = action.payload;
    },
  },
});

export const {
  setProfileData,
  setLoggedIn,
  updateWallet,
  updateNickname,
  updateGender,
  updateBio,
  updateWebsite,
  updateDob,
  updateProfilePic,
  updateLocation,
  updateOnlineStatus,
  updateVerified,
  updateAddress,
  updateSocialIds,
  updatePersonalInfo,
  updateProfileVideo,
  setBottomTabHeight,
  setBottomSectionHeight,
} = profileSlice.actions;

export default profileSlice.reducer;
