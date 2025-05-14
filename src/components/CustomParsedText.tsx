import React from 'react';
import {Linking, StyleSheet} from 'react-native';
import ParsedText from 'react-native-parsed-text';

const CustomParsedText = ({children, style}) => {
  const defaultTextStyle = StyleSheet.compose(styles.text, style);

  const handleUrlPress = url => {
    Linking.openURL(url);
  };
  const handlePhonePress = phone => {
    const phoneNumber = `tel:${phone}`;
    Linking.openURL(phoneNumber);
  };
  const handleEmailPress = email => {
    const emailAddress = `mailto:${email}`;
    Linking.openURL(emailAddress);
  };
  const handleUsernamePress = username => {
    console.log('Username:', username);
  };

  return (
    <ParsedText
      style={defaultTextStyle}
      parse={[
        {type: 'url', style: styles.url, onPress: handleUrlPress},
        {type: 'phone', style: styles.phone, onPress: handlePhonePress},
        {type: 'email', style: styles.email, onPress: handleEmailPress},
        {
          pattern: /\B@([\w.-]+)/i,
          style: styles.username,
          onPress: handleUsernamePress,
        },
      ]}
      childrenProps={{allowFontScaling: false}}>
      {children}
    </ParsedText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 15,
  },

  url: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  email: {
    textDecorationLine: 'underline',
    color: 'blue',
  },

  phone: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  username: {
    color: 'red',
    textDecorationLine: 'underline',
  },
});

export default CustomParsedText;
