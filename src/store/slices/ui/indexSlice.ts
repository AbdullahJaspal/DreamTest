import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SelectedRechargeSheetProps {
  price: string;
  diamonds: number;
}

export interface SoundData {
  id: number;
  sound_id: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  extracted_audio: {
    audio_url: string;
    createdAt: string;
    id: number;
    updatedAt: string;
    user_id: number;
    video_id: number;
    user: {
      id: number;
      profile_pic: string;
      nickname: string;
      username: string;
    };
    video: {
      thum: string;
    };
  };
}

export interface DreamSound {
  audio_url: string;
  createdAt: string;
  id: number;
  isFavourite: number;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
    profile_pic: string;
    username: string;
  };
  user_id: number;
  video: {
    thum: string;
  };
  video_id: number;
}

export interface FavUserData {
  favourite_user_id: number;
  user: {
    id: number;
    profile_pic: string;
    nickname: string;
    username: string;
  };
}

export interface IndexState {
  currentBottomTab: string;
  bottomSheetSignIn: boolean;
  currentUser: string;
  currentVideo: any;
  video_playback: boolean;
  modalSignIn: boolean;
  bottomSheetSettingProfile: boolean;
  bottomSheetLogout: boolean;
  rechargeSheet: boolean;
  paymentSelection: boolean;
  shareSheet: boolean;
  shareContent: string;
  showProfileShareSheet: boolean;
  profileShareContent: string;
  showSoundShareSheet: boolean;
  soundShareContent: string;
  showHastagShareSheet: boolean;
  hastagShareContent: string;
  selected_recharge_sheet_data: SelectedRechargeSheetProps;
  showVideoSectionIcons: boolean;
  favoriteSound: SoundData[];
  dreamSound: DreamSound[];
  favoriteUser: FavUserData[];
  favoritesUpdateCount: number;
}

const initialState: IndexState = {
  currentBottomTab: 'Home',
  bottomSheetSignIn: false,
  currentUser: '',
  currentVideo: '',
  video_playback: true,
  modalSignIn: false,
  bottomSheetSettingProfile: false,
  bottomSheetLogout: false,
  rechargeSheet: false,
  paymentSelection: false,
  shareSheet: false,
  shareContent: '',
  showProfileShareSheet: false,
  profileShareContent: '',
  showHastagShareSheet: false,
  hastagShareContent: '',
  showSoundShareSheet: false,
  favoritesUpdateCount: 0,
  soundShareContent: '',
  selected_recharge_sheet_data: {
    price: '0 $',
    diamonds: 0,
  },
  showVideoSectionIcons: true,
  favoriteSound: [],
  dreamSound: [],
  favoriteUser: [],
};

const indexSlice = createSlice({
  name: 'index',
  initialState,
  reducers: {
    setRechargeSheet: (state, action: PayloadAction<boolean>) => {
      state.rechargeSheet = action.payload;
    },

    setCurrentBottomTab: (state, action: PayloadAction<string>) => {
      state.currentBottomTab = action.payload;
    },

    setBottomSheetSignIn: (state, action: PayloadAction<boolean>) => {
      state.bottomSheetSignIn = action.payload;
    },

    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },

    setModalSignIn: (state, action: PayloadAction<boolean>) => {
      state.modalSignIn = action.payload;
    },

    setBottomSheetSettingProfile: (state, action: PayloadAction<boolean>) => {
      state.bottomSheetSettingProfile = action.payload;
    },

    setBottomSheetLogout: (state, action: PayloadAction<boolean>) => {
      state.bottomSheetLogout = action.payload;
    },

    setPaymentSelectionSheet: (state, action: PayloadAction<boolean>) => {
      state.paymentSelection = action.payload;
    },

    setShareSheet: (state, action: PayloadAction<boolean>) => {
      state.shareSheet = action.payload;
    },

    setShareContent: (state, action: PayloadAction<string>) => {
      state.shareContent = action.payload;
    },

    showProfileShareSheet: (state, action: PayloadAction<boolean>) => {
      state.showProfileShareSheet = action.payload;
    },

    setProfileShareContent: (state, action: PayloadAction<string>) => {
      state.profileShareContent = action.payload;
    },

    showHastagShareSheet: (state, action: PayloadAction<boolean>) => {
      state.showHastagShareSheet = action.payload;
    },

    setHastagShareContent: (state, action: PayloadAction<string>) => {
      state.hastagShareContent = action.payload;
    },

    showSoundShareSheet: (state, action: PayloadAction<boolean>) => {
      state.showSoundShareSheet = action.payload;
    },

    setSoundShareContent: (state, action: PayloadAction<string>) => {
      state.soundShareContent = action.payload;
    },

    setSelectedRechargeData: (
      state,
      action: PayloadAction<SelectedRechargeSheetProps>,
    ) => {
      state.selected_recharge_sheet_data = action.payload;
    },

    setCurrentVideo: (state, action: PayloadAction<any>) => {
      state.currentVideo = action.payload;
    },

    setShowVideoSectionIcons: (state, action: PayloadAction<boolean>) => {
      state.showVideoSectionIcons = action.payload;
    },

    setVideoPlayBack: (state, action: PayloadAction<boolean>) => {
      state.video_playback = action.payload;
    },

    setFavouriteSounds: (state, action: PayloadAction<SoundData[]>) => {
      state.favoriteSound = action.payload;
    },

    addFavouriteSound: (state, action: PayloadAction<SoundData>) => {
      const soundId = action.payload.id || action.payload.sound_id;
      const exists = state.favoriteSound.some(
        sound => sound.id === soundId || sound.sound_id === soundId,
      );
      if (!exists) {
        state.favoriteSound.push(action.payload);
      }
    },

    removeFavouriteSound: (state, action: PayloadAction<number>) => {
      state.favoriteSound = state.favoriteSound.filter(
        sound =>
          sound.id !== action.payload && sound.sound_id !== action.payload,
      );
    },

    toggleFavouriteSound: (state, action: PayloadAction<SoundData>) => {
      const soundId = action.payload.id || action.payload.sound_id;
      const index = state.favoriteSound.findIndex(
        sound => sound.id === soundId || sound.sound_id === soundId,
      );

      if (index >= 0) {
        state.favoriteSound.splice(index, 1);
      } else {
        state.favoriteSound.push(action.payload);
      }
    },

    dreamSound: (state, action: PayloadAction<DreamSound>) => {
      const Id = action.payload.id;
      const exists = state.dreamSound.some(drem => drem.id === Id);
      if (!exists) {
        state.dreamSound.push(action.payload);
      }
    },

    setFavouriteUsers: (state, action: PayloadAction<FavUserData[]>) => {
      state.favoriteUser = action.payload;
    },

    addFavouriteUser: (state, action: PayloadAction<FavUserData>) => {
      const Fav_user_Id = action.payload.favourite_user_id;
      const exists = state.favoriteUser.some(
        user => user.favourite_user_id === Fav_user_Id,
      );
      if (!exists) {
        state.favoriteUser.push(action.payload);
      }
    },

    removeFavouriteUser: (state, action: PayloadAction<number>) => {
      state.favoriteUser = state.favoriteUser.filter(
        user => user.favourite_user_id !== action.payload,
      );
    },

    incrementFavoritesUpdateCount: state => {
      state.favoritesUpdateCount += 1;
    },

    decrementFavoritesUpdateCount: state => {
      state.favoritesUpdateCount -= 1;
    },
  },
});

export const {
  setCurrentBottomTab,
  setBottomSheetSignIn,
  setCurrentUser,
  setModalSignIn,
  setBottomSheetSettingProfile,
  setBottomSheetLogout,
  setRechargeSheet,
  setPaymentSelectionSheet,
  setShareSheet,
  setShareContent,
  showProfileShareSheet,
  setProfileShareContent,
  showHastagShareSheet,
  setHastagShareContent,
  showSoundShareSheet,
  setSoundShareContent,
  setSelectedRechargeData,
  setCurrentVideo,
  setShowVideoSectionIcons,
  setVideoPlayBack,
  setFavouriteSounds,
  addFavouriteSound,
  removeFavouriteSound,
  toggleFavouriteSound,
  addFavouriteUser,
  removeFavouriteUser,
  setFavouriteUsers,
  dreamSound,
  incrementFavoritesUpdateCount,
  decrementFavoritesUpdateCount,
} = indexSlice.actions;

export default indexSlice.reducer;
