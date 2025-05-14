import React, {useRef, useEffect} from 'react';
import {View, TouchableOpacity, Animated, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import styles from '../styles/messageContextStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Text from '../../../../components/Text';

const MessageContextMenu = ({
  isVisible,
  onClose,
  message,
  onReply,
  onForward,
  onCopy,
  onInfo,
  onStar,
  onPin,
  onDelete,
}) => {
  const {t} = useTranslation();
  const menuAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, menuAnimation]);

  if (!isVisible) return null;
  console.log('message==>', message);

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View></View>
      <Animated.View
        style={[
          styles.menuContainer,
          {
            opacity: menuAnimation,
            transform: [
              {
                translateY: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onReply(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Reply')}</Text>
          <MaterialIcons name="reply" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onForward(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Forward')}</Text>
          <MaterialIcons name="forward" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onCopy(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Copy')}</Text>
          <MaterialIcons name="content-copy" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onInfo(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Info')}</Text>
          <MaterialIcons name="info" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onStar(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Star')}</Text>
          <MaterialIcons name="star-border" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onPin(message);
            onClose();
          }}>
          <Text style={styles.menuItemText}>{t('Pin')}</Text>
          <MaterialIcons name="push-pin" size={22} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onDelete(message);
            onClose();
          }}>
          <Text style={styles.deleteText}>{t('Delete')}</Text>
          <MaterialIcons name="delete" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </Animated.View>
    </Pressable>
  );
};

export default MessageContextMenu;
