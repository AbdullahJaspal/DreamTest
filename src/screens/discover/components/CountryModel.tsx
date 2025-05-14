import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Animated, {BounceInUp, BounceOutUp} from 'react-native-reanimated';
import RenderCountry from '../../discover/components/RenderCountry';
import * as countryApi from '../../../apis/countryApi';
import {CountryProps, CountrySelectionProps} from '../types/CountrySelection';

const {width, height} = Dimensions.get('screen');

interface CountryModelProps {
  closeModal: () => void;
  modalVisible: boolean;
  getallvideobycountryid: (data: CountrySelectionProps) => void;
}
const CountryModel: React.FC<CountryModelProps> = ({
  closeModal,
  modalVisible,
  getallvideobycountryid,
}) => {
  const [country, setCountry] = useState<CountryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllCountries = useCallback(async () => {
    if (country?.length <= 0) {
      try {
        setLoading(true);
        const res = await countryApi.getAllCountries();
        setCountry(res?.payload);
      } catch (error) {
        console.log(
          'Error generated while getting all country in search',
          error,
        );
      } finally {
        setLoading(false);
      }
    }
  }, [modalVisible]);

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onShow={getAllCountries}
      onRequestClose={closeModal}>
      <TouchableOpacity
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.50)'}}
        onPressIn={closeModal}
      />

      <Animated.View
        entering={BounceInUp}
        exiting={BounceOutUp}
        style={styles.maincontainer}>
        {loading ? (
          <View style={styles.loader_container}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : (
          <FlatList
            data={country}
            numColumns={3}
            keyExtractor={(_item, index) => index.toString()}
            windowSize={50}
            maxToRenderPerBatch={20}
            renderItem={({item, index}) => (
              <RenderCountry
                item={item}
                index={index}
                getallvideobycountryid={getallvideobycountryid}
                closeModal={closeModal}
              />
            )}
          />
        )}
      </Animated.View>
    </Modal>
  );
};

export default React.memo(CountryModel);

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#fff',
    width: width,
    position: 'absolute',
    top: 0,
    height: height * 0.5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 0,
    paddingBottom: 5,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  loader_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
