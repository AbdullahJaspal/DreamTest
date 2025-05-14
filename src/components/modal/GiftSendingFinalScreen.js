import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';

const window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const GiftSelectionScreen = ({
  setShowGiftSendingModal,
  showGiftSendingModal,
}) => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        width: window.width,
        height: window.height * 0.5,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={icons.gift}
        style={{
          width: window.width * 0.3,
          height: window.width * 0.3,
        }}
      />
      <View style={styles.gift_align}>
        <Image source={icons.coin} style={{width: 10, height: 10}} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Roboto',
            fontWeight: '500',
            marginLeft: 5,
          }}>
          {showGiftSendingModal.item.item.coin *
            showGiftSendingModal.item.diamondX}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setShowGiftSendingModal(prev => ({
            ...prev,
            isVisible: false,
          }));
        }}
        style={{
          backgroundColor: 'rgba(217, 217, 217, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 120,
          marginTop: window.height * 0.08,
          padding: 5,
        }}>
        <Text style={{color: 'black', margin: 5}}>{t('Go Back')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GiftSelectionScreen;

const styles = StyleSheet.create({
  gift_align: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
