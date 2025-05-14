import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardType,
  Pressable,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InputHeader from './InputHeader';
import BottomButton from './BottomButton';
import * as userApi from '../../../../apis/userApi';
import {useTranslation} from 'react-i18next';

interface ChangedInputBoxProps {
  handleCancelButton: () => void;
  handleSaveButton: () => void;
  headerName: string;
  onValueChange: (value: string) => void;
  inputType:
    | 'username'
    | 'nickname'
    | 'email'
    | 'link'
    | 'self description'
    | 'X'
    | 'facebook'
    | 'instagram'
    | 'youtube';
  multiline?: boolean;
  initialValue: string;
  visible: boolean;
}

const {width, height} = Dimensions.get('screen');

const ChangedInputBox: React.FC<ChangedInputBoxProps> = ({
  handleCancelButton,
  handleSaveButton,
  headerName,
  onValueChange,
  inputType,
  multiline = false,
  initialValue,
  visible,
}) => {
  const {t, i18n} = useTranslation();

  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onBackPress = (): boolean => {
      handleCancelButton();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [handleCancelButton]);

  const handleUsernameCheck = async () => {
    try {
      const result = await userApi.checkUsernameAvaliable(value);
      if (!result.available) {
        setError(
          'This username is already taken. Please choose a different one.',
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error occurred while verifying the username', error);
      return false;
    }
  };

  const getKeyboardType = (): KeyboardType => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'link':
        return 'url';
      default:
        return 'default';
    }
  };

  const validateInput = (text: string): string | null => {
    switch (inputType) {
      case 'username':
        if (!/^[a-zA-Z]/.test(text))
          return 'Username must start with a letter.';
        if (!/^[a-zA-Z0-9_]+$/.test(text))
          return 'Only letters, numbers, and underscores are allowed.';
        if (text.length < 3 || text.length > 20)
          return 'Must be 3-20 characters long.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
          return 'Enter a valid email address.';
        break;
      case 'nickname':
        if (text.trim() === '') return 'Nickname cannot be empty.';
        if (text.length > 11)
          return 'Nickname must be less than 10 characters.';
        break;
      case 'self description':
        const trimmedText = text.trim();
        if (trimmedText === '') return 'Self-description cannot be empty.';
        const lines = trimmedText.split('\n');
        if (lines.length > 5) {
          return 'Self-description cannot exceed 5 lines.';
        }
        for (const line of lines) {
          if (line.length > 25) {
            return 'Each line cannot exceed 25 characters.';
          }
        }
        if (text.length > 100)
          return 'Self-description must be less than 100 characters.';
        break;
      case 'X': // Twitter username
        if (!/^[A-Za-z0-9_]{1,15}$/.test(text))
          return 'Twitter username must be 1-15 characters, using only letters, numbers, or underscores.';
        break;
      case 'facebook':
        if (!/^[A-Za-z0-9.]{5,50}$/.test(text))
          return 'Facebook username must be 5-50 characters, using letters, numbers, or periods.';
        break;
      case 'instagram':
        if (!/^[A-Za-z0-9_.]{1,30}$/.test(text))
          return 'Instagram username must be 1-30 characters, using letters, numbers, periods, or underscores.';
        break;
      case 'youtube':
        if (!/^[A-Za-z0-9_-]{1,20}$/.test(text))
          return 'YouTube username must be 1-20 characters, using letters, numbers, underscores, or hyphens.';
        break;
      default:
        return null;
    }
    return null;
  };

  const handleSave = async () => {
    // Validate the current value
    const validationError = validateInput(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (inputType === 'username') {
      // Check username availability if inputType is username
      const isAvailable = await handleUsernameCheck();
      if (!isAvailable) {
        return; // Do not proceed if username is not available
      }
    }

    // No errors, proceed with saving
    setError(null);
    handleSaveButton();
  };

  const handleValueChange = (text: string): void => {
    setValue(text);
    const validationError = validateInput(text);
    setError(validationError);
    onValueChange(text);
  };

  const getRulesText = (): string | null => {
    switch (inputType) {
      case 'username':
        return `${t('Rules for username')}:\n- ${t(
          'Start with a letter',
        )}.\n- ${t('Be 3-20 characters long')}.\n- ${t(
          'Only use letters, numbers, or underscores',
        )}.`;
      case 'email':
        return 'Rules for email:\n- Must be a valid email format.';
      case 'nickname':
        return t('Enter your nickname');
      case 'self description':
        return `${t('Self-description rules')}:\n- ${t(
          'Cannot be empty',
        )}.\n- ${t('Max 200 characters')}.`;
      case 'X':
        return `${t('Rules for Twitter username')}:\n- ${t(
          '1-15 characters',
        )}.\n- ${t('Only letters, numbers, or underscores')}.`;
      case 'facebook':
        return `${t('Rules for Facebook username')}:\n- ${t(
          '5-50 characters',
        )}.\n- ${t('Only letters, numbers, or periods')}.`;
      case 'instagram':
        return `${t('Rules for Instagram username')}:\n- ${t(
          '1-30 characters',
        )}.\n- ${t('Only letters, numbers, periods, or underscores')}.`;
      case 'youtube':
        return `${t('Rules for YouTube username')}:\n- ${t(
          '1-20 characters',
        )}.\n- ${t('Only letters, numbers, underscores, or hyphens')}.`;
      default:
        return null;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Pressable style={styles.super_container} onPress={handleCancelButton}>
      <Pressable style={styles.main_container}>
        {/* Display Header */}
        <InputHeader headertext={t(headerName)} />

        {/* Display the text box */}
        <TextInput
          style={styles.text_input_box}
          placeholder={`Enter your ${inputType}`}
          value={value}
          onChangeText={handleValueChange}
          keyboardType={getKeyboardType()}
          multiline={multiline}
          enterKeyHint="done"
        />

        {/* Real-time validation feedback */}
        <Text
          style={[
            styles.info_text,
            error ? styles.error_text : styles.valid_text,
          ]}>
          {error || t('Looks good!')}
        </Text>

        {/* Rules displayed at the bottom */}
        <Text style={styles.rules_text}>{getRulesText()}</Text>

        {/* Bottom buttons */}
        <BottomButton
          handleCancelButton={handleCancelButton}
          handleSaveButton={handleSave}
        />
      </Pressable>
    </Pressable>
  );
};

export default React.memo(ChangedInputBox);

const styles = StyleSheet.create({
  super_container: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  main_container: {
    width: width * 0.8,
    // height: 300,
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 10,
  },
  text_input_box: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginTop: 20,
    width: '90%',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  info_text: {
    marginTop: 5,
    width: '90%',
    fontSize: 12,
    textAlign: 'left',
  },
  valid_text: {
    color: '#28a745',
  },
  error_text: {
    color: '#d9534f',
  },
  rules_text: {
    marginVertical: 15,
    fontSize: 12,
    color: '#555',
    textAlign: 'left',
    width: '90%',
  },
});
