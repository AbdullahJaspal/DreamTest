import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface LiveMultiButtonState {
  show_voice_effect: boolean;
  show_private_room: boolean;
  show_vote_match: boolean;
  show_multi_guest: boolean;
  show_voice_chat_room: boolean;
  show_games_room: boolean;
  show_vote: boolean;
  show_questions_and_answers: boolean;
  show_buy_frame: boolean;
  show_administration: boolean;
  show_color_font: boolean;
  show_note: boolean;
  show_black_out: boolean;
  show_font: boolean;
  show_background_picture: boolean;
  show_video_background: boolean;
  show_gif_background: boolean;
  show_music: boolean;
  show_gift: boolean;
  show_wheel_box: boolean;
  show_lucky_wheel: boolean;
  show_record_live: boolean;
  show_custom_wheel_luck: boolean;
}

const initialState: LiveMultiButtonState = {
  show_voice_effect: false,
  show_private_room: false,
  show_vote_match: false,
  show_multi_guest: false,
  show_voice_chat_room: false,
  show_games_room: false,
  show_vote: false,
  show_questions_and_answers: false,
  show_buy_frame: false,
  show_administration: false,
  show_color_font: false,
  show_note: false,
  show_black_out: false,
  show_font: false,
  show_background_picture: false,
  show_video_background: false,
  show_gif_background: false,
  show_music: false,
  show_gift: false,
  show_wheel_box: false,
  show_lucky_wheel: false,
  show_record_live: false,
  show_custom_wheel_luck: false,
};

const liveMultiButtonSlice = createSlice({
  name: 'live_multi_button',
  initialState,
  reducers: {
    setShowVoiceEffect: (state, action: PayloadAction<boolean>) => {
      state.show_voice_effect = action.payload;
    },
    setShowPrivateRoom: (state, action: PayloadAction<boolean>) => {
      state.show_private_room = action.payload;
    },
    setShowVoteMatch: (state, action: PayloadAction<boolean>) => {
      state.show_vote_match = action.payload;
    },
    setShowMultiGuest: (state, action: PayloadAction<boolean>) => {
      state.show_multi_guest = action.payload;
    },
    setShowVoiceChatRoom: (state, action: PayloadAction<boolean>) => {
      state.show_voice_chat_room = action.payload;
    },
    setShowGamesRoom: (state, action: PayloadAction<boolean>) => {
      state.show_games_room = action.payload;
    },
    setShowVote: (state, action: PayloadAction<boolean>) => {
      state.show_vote = action.payload;
    },
    setShowQuestionsAndAnswers: (state, action: PayloadAction<boolean>) => {
      state.show_questions_and_answers = action.payload;
    },
    setShowBuyFrame: (state, action: PayloadAction<boolean>) => {
      state.show_buy_frame = action.payload;
    },
    setShowAdministration: (state, action: PayloadAction<boolean>) => {
      state.show_administration = action.payload;
    },
    setShowColorFont: (state, action: PayloadAction<boolean>) => {
      state.show_color_font = action.payload;
    },
    setShowNote: (state, action: PayloadAction<boolean>) => {
      state.show_note = action.payload;
    },
    setShowBlackOut: (state, action: PayloadAction<boolean>) => {
      state.show_black_out = action.payload;
    },
    setShowFont: (state, action: PayloadAction<boolean>) => {
      state.show_font = action.payload;
    },
    setShowBackgroundPicture: (state, action: PayloadAction<boolean>) => {
      state.show_background_picture = action.payload;
    },
    setShowVideoBackground: (state, action: PayloadAction<boolean>) => {
      state.show_video_background = action.payload;
    },
    setShowGifBackground: (state, action: PayloadAction<boolean>) => {
      state.show_gif_background = action.payload;
    },
    setShowMusic: (state, action: PayloadAction<boolean>) => {
      state.show_music = action.payload;
    },
    setShowGift: (state, action: PayloadAction<boolean>) => {
      state.show_gift = action.payload;
    },
    setShowWheelBox: (state, action: PayloadAction<boolean>) => {
      state.show_wheel_box = action.payload;
    },
    setShowLuckyWheel: (state, action: PayloadAction<boolean>) => {
      state.show_lucky_wheel = action.payload;
    },
    setShowRecordLive: (state, action: PayloadAction<boolean>) => {
      state.show_record_live = action.payload;
    },
    setShowCustomWheelLuck: (state, action: PayloadAction<boolean>) => {
      state.show_custom_wheel_luck = action.payload;
    },
  },
});

export const {
  setShowVoiceEffect,
  setShowPrivateRoom,
  setShowVoteMatch,
  setShowMultiGuest,
  setShowVoiceChatRoom,
  setShowGamesRoom,
  setShowVote,
  setShowQuestionsAndAnswers,
  setShowBuyFrame,
  setShowAdministration,
  setShowColorFont,
  setShowNote,
  setShowBlackOut,
  setShowFont,
  setShowBackgroundPicture,
  setShowVideoBackground,
  setShowGifBackground,
  setShowMusic,
  setShowGift,
  setShowWheelBox,
  setShowLuckyWheel,
  setShowRecordLive,
  setShowCustomWheelLuck,
} = liveMultiButtonSlice.actions;

export default liveMultiButtonSlice.reducer;
