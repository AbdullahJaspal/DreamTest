import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, {SetStateAction, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
interface PrivacyTypelSelectionProps {
  privacyVisible: boolean;
  setPrivacyVisible: React.Dispatch<SetStateAction<boolean>>;
  top: number;
  left: number;
  onSelect: (item: string) => void;
}

const PrivacyTypelSelection: React.FC<PrivacyTypelSelectionProps> = ({
  privacyVisible,
  setPrivacyVisible,
  top,
  left,
  onSelect,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {t, i18n} = useTranslation();
  useEffect(() => {
    if (privacyVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }
  }, [privacyVisible, fadeAnim]);

  if (!privacyVisible) {
    return null;
  }

  function handleSelectionClose(event: GestureResponderEvent): void {
    setPrivacyVisible(false);
  }

  return (
    <Pressable style={styles.main_container} onPress={handleSelectionClose}>
      <Animated.View
        style={[
          styles.list_view,
          {left: left - 120, top: top, opacity: fadeAnim},
        ]}>
        <FlatList
          data={['Public', 'Private', 'Friends']}
          renderItem={({item}) => (
            <Text
              onPress={() => {
                onSelect(item);
              }}
              style={styles.list_txt}>
              {t(item)}
            </Text>
          )}
        />
      </Animated.View>
    </Pressable>
  );
};

export default React.memo(PrivacyTypelSelection);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 10000,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  list_txt: {
    width: 120,
    height: 27,
    color: '#000',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  list_view: {
    width: 120,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1000,
    elevation: 15,
    borderRadius: 5,
  },
});
