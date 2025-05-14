import {createSlice} from '@reduxjs/toolkit';
import {
  FONT_FILES,
  FONT_GROUPS,
  isArabicText,
  getAppropriateFont,
  getBoldFont,
  getItalicFont,
} from '../../../utils/FontRegistry';

// Initial state for font settings
const initialState = {
  selectedFont: {
    id: 'default',
    name: 'Default',
    fontFamily: undefined,
  },
  recentFonts: [], // Store recently used fonts
  availableFonts: {
    english: [
      {id: 'default', name: 'Default', fontFamily: undefined},
      {id: 'roboto', name: 'Roboto', fontFamily: 'Roboto'},
      {id: 'opensans', name: 'Open Sans', fontFamily: 'OpenSans'},
      {id: 'montserrat', name: 'Montserrat', fontFamily: 'Montserrat'},
      {id: 'lato', name: 'Lato', fontFamily: 'Lato'},
      {id: 'poppins', name: 'Poppins', fontFamily: 'Poppins'},
      {id: 'ubuntu', name: 'Ubuntu', fontFamily: 'Ubuntu'},
      {
        id: 'playfairdisplay',
        name: 'Playfair Display',
        fontFamily: 'PlayfairDisplay',
      },
      {id: 'merriweather', name: 'Merriweather', fontFamily: 'Merriweather'},
    ],
    arabic: [
      {id: 'arabic-default', name: 'Default Arabic', fontFamily: undefined},
      {id: 'tajawal', name: 'Tajawal', fontFamily: 'Tajawal'},
      {id: 'cairo', name: 'Cairo', fontFamily: 'Cairo'},
      {id: 'amiri', name: 'Amiri', fontFamily: 'Amiri'},
      {id: 'changa', name: 'Changa', fontFamily: 'Changa'},
      {id: 'lateef', name: 'Lateef', fontFamily: 'Lateef'},
      {id: 'mukta', name: 'Mukta', fontFamily: 'Mukta'},
    ],
  },
  fontSizeScale: 1.0,
};

// Create the font slice
const fontSlice = createSlice({
  name: 'fonts',
  initialState,
  reducers: {
    // Set the selected font
    setSelectedFont: (state, action) => {
      const newFont = action.payload;
      state.selectedFont = newFont;

      // Add to recent fonts (if not already there)
      const existingIndex = state.recentFonts.findIndex(
        font => font.id === newFont.id,
      );
      if (existingIndex !== -1) {
        // If font exists in recent fonts, remove it so we can move it to the front
        state.recentFonts.splice(existingIndex, 1);
      }

      // Add to beginning of recent fonts array and limit to 5 entries
      state.recentFonts.unshift(newFont);
      if (state.recentFonts.length > 5) {
        state.recentFonts.pop();
      }
    },

    // Clear recent fonts
    clearRecentFonts: state => {
      state.recentFonts = [];
    },

    // Add custom font - for future implementation
    addCustomFont: (state, action) => {
      const {fontType, font} = action.payload;
      if (fontType === 'arabic' || fontType === 'english') {
        state.availableFonts[fontType].push(font);
      }
    },

    // Set font size scale
    setFontSizeScale: (state, action) => {
      const scale = action.payload;
      if (typeof scale === 'number' && scale >= 0.8 && scale <= 1.5) {
        state.fontSizeScale = scale;
      }
    },

    // Remove custom font
    removeCustomFont: (state, action) => {
      const {fontType, fontId} = action.payload;
      if (fontType === 'arabic' || fontType === 'english') {
        state.availableFonts[fontType] = state.availableFonts[fontType].filter(
          font => font.id !== fontId,
        );
      }

      // Also remove from recent fonts if present
      state.recentFonts = state.recentFonts.filter(font => font.id !== fontId);

      // Reset selected font if it was the removed font
      if (state.selectedFont.id === fontId) {
        state.selectedFont = {
          id: 'default',
          name: 'Default',
          fontFamily: undefined,
        };
      }
    },
  },
});

// Export actions
export const {
  setSelectedFont,
  clearRecentFonts,
  addCustomFont,
  setFontSizeScale,
  removeCustomFont,
} = fontSlice.actions;

// Export selectors
export const selectSelectedFont = state => state.fonts.selectedFont;
export const selectRecentFonts = state => state.fonts.recentFonts;
export const selectAvailableFonts = state => state.fonts.availableFonts;
export const selectFontSizeScale = state => state.fonts.fontSizeScale;

// Get the appropriate font for text content
export const selectFontForText = (state, text) => {
  const selectedFont = state.fonts.selectedFont;

  // If no specific font is selected, return appropriate default based on text
  if (!selectedFont.fontFamily) {
    const appropriateFontFamily = getAppropriateFont(text);

    const fontList = isArabicText(text)
      ? state.fonts.availableFonts.arabic
      : state.fonts.availableFonts.english;

    const defaultFont = fontList.find(
      font => font.fontFamily === appropriateFontFamily,
    );

    return defaultFont || selectedFont;
  }

  return selectedFont;
};

// Get the bold variant of the current font
export const selectBoldFont = state => {
  const selectedFont = state.fonts.selectedFont;

  if (!selectedFont.fontFamily) {
    return selectedFont;
  }

  const boldFontFamily = getBoldFont(selectedFont.fontFamily);

  if (boldFontFamily === selectedFont.fontFamily) {
    return selectedFont;
  }

  // Find the bold font entry in available fonts
  const allFonts = [
    ...state.fonts.availableFonts.english,
    ...state.fonts.availableFonts.arabic,
  ];

  return (
    allFonts.find(font => font.fontFamily === boldFontFamily) || selectedFont
  );
};

// Get the italic variant of the current font
export const selectItalicFont = state => {
  const selectedFont = state.fonts.selectedFont;

  if (!selectedFont.fontFamily) {
    return selectedFont;
  }

  const italicFontFamily = getItalicFont(selectedFont.fontFamily);

  if (italicFontFamily === selectedFont.fontFamily) {
    return selectedFont;
  }

  // Find the italic font entry in available fonts
  const allFonts = [
    ...state.fonts.availableFonts.english,
    ...state.fonts.availableFonts.arabic,
  ];

  return (
    allFonts.find(font => font.fontFamily === italicFontFamily) || selectedFont
  );
};

// Export reducer
export default fontSlice.reducer;
