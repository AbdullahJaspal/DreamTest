import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ParsedText from 'react-native-parsed-text';

interface DescriptionTextParserProps {
  text: string;
}
const DescriptionTextParser: React.FC<DescriptionTextParserProps> = ({
  text,
}) => {
  return (
    <ParsedText
      style={styles.text}
      parse={[
        {
          pattern: /#(\w+)/,
          style: styles.hashTag,
        },
        {
          pattern: /@(\w+)/,
          style: styles.mention,
        },
      ]}
      childrenProps={{allowFontScaling: false}}>
      {text}
    </ParsedText>
  );
};

export default DescriptionTextParser;

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    lineHeight: 25,
  },
  mention: {
    color: '#055be5',
    fontSize: 14,
    fontWeight: '800',
  },
  hashTag: {
    fontStyle: 'italic',
    color: '#055be5',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 23,
  },
});
