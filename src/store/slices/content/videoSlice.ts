import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface GiftData {
  video_link: string;
  video_id: number;
}

export interface VideoState {
  video_url: string | null;
  show_loader: boolean;
  play_video: boolean;
  show_recording: boolean;
  text_overlay: string;
  giftData: GiftData;
}

const initialState: VideoState = {
  video_url: null,
  show_loader: false,
  play_video: true,
  show_recording: true,
  text_overlay: '',
  giftData: {
    video_link: '',
    video_id: -1,
  },
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    change_video_url(state, action: PayloadAction<string | null>) {
      state.video_url = action.payload;
    },

    change_loading(state, action: PayloadAction<boolean>) {
      state.show_loader = action.payload;
    },

    set_play_video(state) {
      state.play_video = !state.play_video;
    },

    setShow_recording(state) {
      state.show_recording = !state.show_recording;
    },

    setTextOverLay(state, action: PayloadAction<string>) {
      state.text_overlay = action.payload;
    },

    updateGiftData(state, action: PayloadAction<GiftData>) {
      state.giftData = action.payload;
    },
  },
});

export const {
  change_video_url,
  change_loading,
  set_play_video,
  setShow_recording,
  setTextOverLay,
  updateGiftData,
} = videoSlice.actions;

export default videoSlice.reducer;
