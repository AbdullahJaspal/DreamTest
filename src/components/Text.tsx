import React, {useMemo} from 'react';
import {Text as RNText} from 'react-native';
import {useSelector} from 'react-redux';
import {selectSelectedFont} from '../store/slices/ui/fontSlice';
import {isArabicText, getAppropriateFont} from '../utils/FontRegistry';

const Text = ({children, style, useSelectedFont = true, ...props}) => {
  const selectedFont = useSelector(selectSelectedFont);

  const textContent =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children.join('')
      : '';

  const isArabic = isArabicText(textContent);

  const combinedStyle = useMemo(() => {
    const baseStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style || {};

    if (useSelectedFont) {
      const fontFamily =
        selectedFont?.fontFamily || (isArabic ? 'Tajawal' : 'Roboto');

      return {
        ...baseStyle,
        fontFamily,
        textAlign: baseStyle.textAlign || (isArabic ? 'right' : 'left'),
        writingDirection:
          baseStyle.writingDirection || (isArabic ? 'rtl' : 'ltr'),
      };
    }

    return baseStyle;
  }, [style, selectedFont, isArabic, useSelectedFont]);

  return (
    <RNText style={combinedStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
