import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useMemo, useCallback} from 'react';
import ParsedText from 'react-native-parsed-text';

interface CustomDesParserProps {
  text: string;
  hideMoreButton?: boolean;
  boldFirstWord?: boolean;
  lineBreakAfterFirstWord?: boolean;
  maxLength?: number;
}

const CustomDesParser: React.FC<CustomDesParserProps> = ({
  text,
  hideMoreButton,
  boldFirstWord = false,
  lineBreakAfterFirstWord = false,
  maxLength = 60,
}) => {
  const [showFullText, setShowFullText] = useState<boolean>(false);

  const [firstWord, remainingText] = useMemo(() => {
    if (!text) return ['', ''];
    const words = text.trim().split(/\s+/);
    if (words.length === 0) return ['', ''];
    return [words[0], words.slice(1).join(' ')];
  }, [text]);

  const displayText = useMemo(() => {
    const fullText = text;
    if (showFullText) {
      return fullText;
    } else {
      // Ensure we leave space for the "more" button by reducing maxLength further
      if (fullText.length > maxLength) {
        return `${fullText.slice(0, maxLength - 5)}...`;
      }
      return fullText;
    }
  }, [text, showFullText]);

  const handleHashtagPress = useCallback((_text: string) => {}, []);

  const handleFullTextClick = useCallback(() => {
    setShowFullText(prev => !prev);
  }, []);

  const renderText = () => {
    if (!boldFirstWord && !lineBreakAfterFirstWord) {
      return (
        <ParsedText
          style={styles.text}
          parse={[
            {
              pattern: /#(\w+)/,
              style: styles.hashTag,
              onPress: handleHashtagPress,
            },
          ]}
          childrenProps={{allowFontScaling: false}}>
          {displayText}
        </ParsedText>
      );
    }

    const truncated = !showFullText && text.length > maxLength;
    const showRemainingText = firstWord && remainingText;
    let remainingDisplayText = showRemainingText
      ? truncated
        ? remainingText.slice(0, maxLength - firstWord.length - 5) + '...'
        : remainingText
      : '';

    return (
      <Text style={styles.text}>
        <Text style={boldFirstWord ? styles.boldText : undefined}>
          {firstWord}
        </Text>
        {lineBreakAfterFirstWord ? '\n' : ' '}
        {remainingDisplayText}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>{renderText()}</View>

      {!hideMoreButton && text.length > maxLength && (
        <TouchableOpacity
          style={styles.more_button}
          onPress={handleFullTextClick}>
          <Text style={styles.moreText}>{showFullText ? 'less' : 'more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CustomDesParser);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    padding: 5,
    position: 'relative',
  },
  textContainer: {
    paddingRight: 20,
  },
  hashTag: {
    fontStyle: 'italic',
    color: '#2CFFF9',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 23,
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    textAlign: 'left',
    lineHeight: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  moreText: {
    color: '#FF0113',
    fontSize: 10,
    fontWeight: '600',
  },
  more_button: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
});
