import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, TextStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import Text from '../../../../components/Text';

interface ExpandableMessageTextProps {
  text: string;
  textStyle: TextStyle;
  initialDisplayAmount?: number;
  incrementAmount?: number;
  readMoreText?: string;
  readLessText?: string;
  readMoreStyle?: TextStyle;
  truncateBy?: 'lines' | 'chars';
}

const ExpandableMessageText: React.FC<ExpandableMessageTextProps> = ({
  text,
  textStyle,
  initialDisplayAmount = 5,
  incrementAmount = 20,
  readMoreText,
  readLessText,
  readMoreStyle,
  truncateBy = 'chars',
}) => {
  const {t} = useTranslation();

  const translatedReadMore = readMoreText || t('Read more');
  const translatedReadLess = readLessText || t('Show less');

  const [displayAmount, setDisplayAmount] = useState(initialDisplayAmount);
  const [expansionLevel, setExpansionLevel] = useState(0);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  // Add a key state to force Text component re-render when lines change
  const [textKey, setTextKey] = useState(0);

  const getTotalLineCount = () => {
    return (text.match(/\n/g) || []).length + 1;
  };

  useEffect(() => {
    if (!text) return;

    if (truncateBy === 'chars') {
      setNeedsTruncation(text.length > initialDisplayAmount);
    } else {
      const lineCount = getTotalLineCount();
      setNeedsTruncation(lineCount > initialDisplayAmount);
    }

    setDisplayAmount(initialDisplayAmount);
    setExpansionLevel(0);
    setIsFullyExpanded(false);
  }, [text, initialDisplayAmount, truncateBy]);

  const toggleExpand = () => {
    if (isFullyExpanded) {
      setDisplayAmount(initialDisplayAmount);
      setExpansionLevel(0);
      setIsFullyExpanded(false);
      // Increment key to force Text component re-render
      setTextKey(prev => prev + 1);
    } else {
      if (truncateBy === 'chars') {
        const newAmount = displayAmount + incrementAmount;
        if (newAmount >= text.length) {
          setDisplayAmount(text.length);
          setIsFullyExpanded(true);
        } else {
          setDisplayAmount(newAmount);
        }
      } else {
        const newLevel = expansionLevel + 1;
        const totalLines = getTotalLineCount();
        const newLineCount = initialDisplayAmount + incrementAmount * newLevel;

        if (newLineCount >= totalLines) {
          setIsFullyExpanded(true);
        } else {
          setExpansionLevel(newLevel);
        }
        // Increment key to force Text component re-render
        setTextKey(prev => prev + 1);
      }
    }
  };

  const getCurrentNumberOfLines = () => {
    if (isFullyExpanded) {
      return undefined; // Show all lines when fully expanded
    }

    if (truncateBy === 'lines') {
      // Calculate number of lines based on expansion level
      return initialDisplayAmount + incrementAmount * expansionLevel;
    }

    return undefined; // For character-based truncation, no line limit
  };

  const defaultReadMoreStyle: TextStyle = {
    color: '#808080',
    fontSize: (textStyle.fontSize || 16) - 2,
    fontWeight: '500',
    marginTop: 4,
  };

  const finalReadMoreStyle = {
    ...defaultReadMoreStyle,
    ...readMoreStyle,
  };

  if (!text) return null;

  if (!needsTruncation) {
    return <Text style={textStyle}>{text}</Text>;
  }

  if (truncateBy === 'chars') {
    const displayText = isFullyExpanded
      ? text
      : text.slice(0, displayAmount) +
        (text.length > displayAmount ? '...' : '');

    return (
      <View>
        <Text style={textStyle}>{displayText}</Text>
        <TouchableOpacity
          onPress={toggleExpand}
          activeOpacity={0.7}
          style={{alignSelf: 'flex-start'}}>
          <Text style={finalReadMoreStyle}>
            {isFullyExpanded ? translatedReadLess : translatedReadMore}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // This is the line-based truncation case
  return (
    <View>
      {/* Add key prop to force re-render when number of lines changes */}
      <Text
        key={`text-${textKey}`}
        style={textStyle}
        numberOfLines={getCurrentNumberOfLines()}>
        {text}
      </Text>
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={{alignSelf: 'flex-start'}}>
        <Text style={finalReadMoreStyle}>
          {isFullyExpanded ? translatedReadLess : translatedReadMore}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpandableMessageText;
