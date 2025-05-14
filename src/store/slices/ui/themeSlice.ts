import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ThemeColorState {
  chatThemeColor: string;
  defaultChatColor: string;
  recentColors: string[];
  darkMode: boolean;
}

const initialState: ThemeColorState = {
  chatThemeColor: '#54AD7A',
  defaultChatColor: '#54AD7A',
  recentColors: ['#54AD7A', '#2196F3', '#9C27B0', '#F44336', '#FF9800'],
  darkMode: true,
};

const updateRecentColors = (state: ThemeColorState, color: string) => {
  const filteredColors = state.recentColors.filter(c => c !== color);

  filteredColors.unshift(color);

  state.recentColors = filteredColors.slice(0, 5);
};

const chatThemeSlice = createSlice({
  name: 'themeColor',
  initialState,
  reducers: {
    setChatThemeColor: (state, action: PayloadAction<string>) => {
      updateRecentColors(state, action.payload);
      state.chatThemeColor = action.payload;
    },

    resetChatThemeColor: state => {
      state.chatThemeColor = state.defaultChatColor;
    },

    setDefaultChatColor: (state, action: PayloadAction<string>) => {
      state.defaultChatColor = action.payload;
    },

    addToRecentColors: (state, action: PayloadAction<string>) => {
      updateRecentColors(state, action.payload);
    },

    clearRecentColors: state => {
      state.recentColors = [state.defaultChatColor];
    },

    toggleDarkMode: state => {
      state.darkMode = !state.darkMode;
    },

    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

// Export actions
export const {
  setChatThemeColor,
  resetChatThemeColor,
  setDefaultChatColor,
  addToRecentColors,
  clearRecentColors,
  toggleDarkMode,
  setDarkMode,
} = chatThemeSlice.actions;

// Export reducer
export default chatThemeSlice.reducer;
