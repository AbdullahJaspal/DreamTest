export const FONT_FILES = {
  // English Fonts
  Lato: 'Lato-Regular',
  'Lato-Bold': 'Lato-Bold',
  Merriweather: 'Merriweather-Regular',
  'Merriweather-Bold': 'Merriweather-Bold',
  OpenSans: 'OpenSans-Regular',
  'OpenSans-Bold': 'OpenSans-Bold',
  Roboto: 'Roboto-Regular',
  'Roboto-Bold': 'Roboto-Bold',
  'Roboto-Italic': 'Roboto-Italic',
  Poppins: 'Poppins-Regular',
  'Poppins-Bold': 'Poppins-Bold',
  Montserrat: 'Montserrat-Regular',
  'Montserrat-Bold': 'Montserrat-Bold',
  Ubuntu: 'Ubuntu-Regular',
  'Ubuntu-Bold': 'Ubuntu-Bold',
  PlayfairDisplay: 'PlayfairDisplay-Regular',
  'PlayfairDisplay-Bold': 'PlayfairDisplay-Bold',

  // Arabic Fonts
  Tajawal: 'Tajawal-Regular',
  'Tajawal-Bold': 'Tajawal-Bold',
  Cairo: 'Cairo-Regular',
  'Cairo-Bold': 'Cairo-Bold',
  Amiri: 'Amiri-Regular',
  'Amiri-Bold': 'Amiri-Bold',
  Changa: 'Changa-Regular',
  'Changa-Bold': 'Changa-Bold',
  Lateef: 'Lateef-Regular',
  'Lateef-Bold': 'Lateef-Bold',
  Mukta: 'Mukta-Regular',
  'Mukta-Bold': 'Mukta-Bold',
};

export const FONT_GROUPS = {
  default: {
    regular: undefined,
    bold: undefined,
    italic: undefined,
  },
  Roboto: {
    regular: 'Roboto',
    bold: 'Roboto-Bold',
    italic: 'Roboto-Italic',
  },
  OpenSans: {
    regular: 'OpenSans',
    bold: 'OpenSans-Bold',
    italic: 'OpenSans',
  },
  Montserrat: {
    regular: 'Montserrat',
    bold: 'Montserrat-Bold',
    italic: 'Montserrat',
  },
  // Add similar entries for other font families

  // Arabic font groups
  Tajawal: {
    regular: 'Tajawal',
    bold: 'Tajawal-Bold',
    italic: 'Tajawal',
  },
  Cairo: {
    regular: 'Cairo',
    bold: 'Cairo-Bold',
    italic: 'Cairo',
  },
  // Add similar entries for other Arabic font families
};

// Helper function to get bold variant of a font
export const getBoldFont = fontFamily => {
  if (!fontFamily) return undefined;

  // Find the font group
  const fontGroup = Object.keys(FONT_GROUPS).find(
    groupName => FONT_GROUPS[groupName].regular === fontFamily,
  );

  // Return the bold variant if found, otherwise return the original
  return fontGroup ? FONT_GROUPS[fontGroup].bold : fontFamily;
};

// Helper function to get italic variant of a font
export const getItalicFont = fontFamily => {
  if (!fontFamily) return undefined;

  // Find the font group
  const fontGroup = Object.keys(FONT_GROUPS).find(
    groupName => FONT_GROUPS[groupName].regular === fontFamily,
  );

  // Return the italic variant if found, otherwise return the original
  return fontGroup ? FONT_GROUPS[fontGroup].italic : fontFamily;
};

// Helper function to detect if text is Arabic
export const isArabicText = text => {
  if (!text) return false;

  // Arabic unicode range
  const arabicPattern =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

// Get appropriate default font based on text content
export const getAppropriateFont = (text, selectedFont) => {
  // If a specific font is selected, use it
  if (selectedFont && selectedFont !== 'default') {
    return selectedFont;
  }

  // Otherwise, choose based on text content
  return isArabicText(text) ? 'Tajawal' : 'Roboto';
};
