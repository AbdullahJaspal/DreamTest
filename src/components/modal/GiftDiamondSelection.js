import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';

const window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const GiftSelectionScreen = ({
  setShowDimanondSelectionModal,
  setShowGiftSendingModal,
  showDimanondSelectionModal,
}) => {
  const {t, i18n} = useTranslation();

  const [selected, setSelected] = useState({
    id: 0,
    item: showDimanondSelectionModal.item,
    diamondX: 2,
  });
  const Data = [
    {
      id: 0,
      item: showDimanondSelectionModal.item,
      diamondX: 2,
    },
    {
      id: 1,
      item: showDimanondSelectionModal.item,
      diamondX: 4,
    },
    {
      id: 2,
      item: showDimanondSelectionModal.item,
      diamondX: 6,
    },
  ];
  const sendGift = () => {
    setShowDimanondSelectionModal(pre => ({
      ...pre,
      isVisible: false,
    }));
    setShowGiftSendingModal(pre => ({
      ...pre,
      isVisible: true,
      item: selected,
    }));
  };

  return (
    <View
      style={{
        width: window.width * 1,
        height: window.height * 0.5,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        // justifyContent: 'center'
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: window.width * 1,
          marginTop: window.height * 0.015,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Roboto',
            fontWeight: '900',
            marginLeft: window.width * 0.32,
            color: '#000000',
          }}>
          Diamond Box
        </Text>
        <TouchableOpacity
          onPress={() => {
            setShowDimanondSelectionModal(pre => ({
              ...pre,
              isVisible: false,
            }));
          }}>
          <Image
            source={icons.cut}
            style={{
              width: 20,
              height: 20,
              marginLeft: window.width * 0.22,
              tintColor: '#000000',
            }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={Data}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              setSelected(item);
            }}
            style={styles.gift_main_container}>
            <View style={styles.gift_align}>
              <Image source={icons.gift} style={{width: 30, height: 30}} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  marginLeft: 5,
                  color: '#000000',
                }}>
                {t('Diamond')} {item.diamondX}x
              </Text>
            </View>

            <View
              style={[
                styles.gift_align,
                {
                  backgroundColor: index == selected.id ? '#F42020' : 'white',
                  paddingHorizontal: 3,
                  paddingVertical: 2,
                  borderRadius: 4,
                },
              ]}>
              <Image source={icons.coin} style={{width: 10, height: 10}} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  marginLeft: 5,
                  color: '#000000',
                }}>
                {item.diamondX * showDimanondSelectionModal.item.coin}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={sendGift}
        style={{
          backgroundColor: '#F42020',
          alignItems: 'center',
          justifyContent: 'center',
          width: window.width * 0.4,
          marginBottom: window.height * 0.1,
          padding: 5,
          borderRadius: 5,
        }}>
        <Text style={{color: 'white', margin: 5}}>Send</Text>
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
  gift_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: window.height * 0.04,
    width: window.width * 1,
  },
});
