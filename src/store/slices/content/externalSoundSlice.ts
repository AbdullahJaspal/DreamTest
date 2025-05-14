import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ExternalSoundState {
  external_audio_url: string | null;
  nickname: string | null;
  remixedVideoId: number;
  soundRemoteUrl: string | null;
}

export type InitialState = ExternalSoundState;

const initialState: ExternalSoundState = {
  external_audio_url: null,
  nickname: null,
  remixedVideoId: -1,
  soundRemoteUrl: null,
};

const externalSoundSlice = createSlice({
  name: 'externalaudio_url',
  initialState,
  reducers: {
    addExternalAudio(state, action: PayloadAction<string | null>) {
      state.external_audio_url = action.payload;
    },
    addNickname(state, action: PayloadAction<string | null>) {
      state.nickname = action.payload;
    },
    setRemixedVideoId(state, action: PayloadAction<number>) {
      state.remixedVideoId = action.payload;
    },
    setSoundRemoteUrl(state, action: PayloadAction<string | null>) {
      state.soundRemoteUrl = action.payload;
    },
  },
});

// Export actions
export const {
  addExternalAudio,
  addNickname,
  setRemixedVideoId,
  setSoundRemoteUrl,
} = externalSoundSlice.actions;

// Export reducer
export default externalSoundSlice.reducer;
