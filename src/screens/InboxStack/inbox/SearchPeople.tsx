import React, {useRef, useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

interface SearchPeopleProps {
  searched_data: any[];
  setSearched_data: (data: any[]) => void;
  data?: any[];
  onChangeText?: (text: string) => void;
  value?: string;
  placeholder?: string;
}

const {width} = Dimensions.get('screen');

const SearchPeople: React.FC<SearchPeopleProps> = ({
  searched_data,
  setSearched_data,
  data = [],
  onChangeText,
  value = '',
  placeholder,
}) => {
  const {t} = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animation for focus/blur
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedValue]);

  // Handle search text change
  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      // Legacy implementation for backward compatibility
      if (!text.trim()) {
        setSearched_data([]);
        return;
      }

      const filteredData = data.filter(item => {
        if ('notification_name' in item) {
          return item.notification_name
            .toLowerCase()
            .includes(text.toLowerCase());
        } else if ('username' in item) {
          return item.username?.toLowerCase().includes(text.toLowerCase());
        }
        return false;
      });

      setSearched_data(filteredData);
    }
  };

  // Clear search
  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    } else {
      setSearched_data([]);
    }
    inputRef.current?.clear();
    Keyboard.dismiss();
  };

  // Focus the input
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Blur the input
  const handleBlur = () => {
    setIsFocused(false);
  };

  const interpolatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width - 32, width - 76], // Smaller width when focused to make room for cancel button
  });

  const interpolatedButtonOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {width: interpolatedWidth},
          isFocused && styles.searchContainerFocused,
        ]}>
        <MaterialIcons
          name="search"
          size={20}
          color="#9E9E9E"
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder || t('Search...')}
          placeholderTextColor="#9E9E9E"
          onChangeText={handleChangeText}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {(value || (searched_data && searched_data.length > 0)) && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}>
            <MaterialIcons name="close" size={18} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {isFocused && (
        <Animated.View
          style={[
            styles.cancelContainer,
            {opacity: interpolatedButtonOpacity},
          ]}>
          <TouchableOpacity
            onPress={() => {
              handleClear();
              handleBlur();
              Keyboard.dismiss();
            }}
            activeOpacity={0.7}>
            <MaterialIcons name="cancel" size={20} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(SearchPeople);

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchContainer: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchContainerFocused: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: '#212121',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  cancelContainer: {
    marginLeft: 8,
    justifyContent: 'center',
  },
});
