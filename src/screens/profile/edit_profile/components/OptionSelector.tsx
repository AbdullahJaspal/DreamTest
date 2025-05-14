import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import InputHeader from './InputHeader';
import BottomButton from './BottomButton';
import {RadioButton} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');

interface OptionSelectorProps {
  headerName: string;
  handleCancelButton: () => void;
  handleSave: (value: string) => void;
  value: string[];
  initialValue: string;
  visible: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  headerName,
  handleCancelButton,
  handleSave,
  value,
  initialValue,
  visible,
}) => {
  const {t, i18n} = useTranslation();

  const [selectedOption, setSelectedOption] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSaveButton = () => {
    if (!selectedOption) {
      setError('Please select any option before saving.');
    } else {
      setError(null);
      handleSave(selectedOption);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Pressable style={styles.super_container}>
      <Pressable style={styles.main_container}>
        {/* Display Header */}
        <InputHeader headertext={t(headerName)} />

        <FlatList
          data={value}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  setSelectedOption(item);
                  setError(null);
                }}
                style={styles.optionContainer}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value={item}
                    status={selectedOption === item ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSelectedOption(item);
                      setError(null);
                    }}
                    color="#6200ee"
                  />
                  <Text style={styles.optionText}>{t(item)}</Text>
                </View>
              </Pressable>
            );
          }}
          keyExtractor={item => item}
          ListFooterComponent={
            error ? <Text style={styles.errorText}>{error}</Text> : null
          }
        />

        {/* Bottom buttons */}
        <BottomButton
          handleCancelButton={handleCancelButton}
          handleSaveButton={handleSaveButton}
        />
      </Pressable>
    </Pressable>
  );
};

export default React.memo(OptionSelector);

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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: width * 0.8,
    marginVertical: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
