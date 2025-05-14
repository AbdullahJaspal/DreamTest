import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import RenderListItem from './RenderListItem';
import * as countryApi from '../../../apis/countryApi';
import CountryModel from './CountryModel';
import {useIsFocused} from '@react-navigation/native';
import RenderArabicCountry from './RenderArabicCountry';
import {useTranslation} from 'react-i18next';
import EmptyScreen from '../../../utils/emptyScreen';
import {icons} from '../../../assets/icons';

interface ListDiscoverVideoProps {
  videos: any;
  loading: boolean;
  countryVideo: any;
  handleGeneralVideoEndReached: () => void;
  handleGetCountryVideo: (countryId: number) => void;
  handleGeneralVideoImagePress: (index: number, video_id: number) => void;
  handleCountryVideoImagePress: (index: number, video_id: number) => void;
}

const {width, height} = Dimensions.get('screen');

const ListDiscoverVideo: React.FC<ListDiscoverVideoProps> = ({
  videos,
  loading,
  countryVideo,
  handleGeneralVideoEndReached,
  handleGetCountryVideo,
  handleCountryVideoImagePress,
  handleGeneralVideoImagePress,
}) => {
  const {t, i18n} = useTranslation();
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [displayedVideos, setDisplayedVideos] = useState<any>('general');
  const isFocusTab = useIsFocused();
  const [Arabiccountry, SetArabiccountry] = useState<any>([]);

  const getAllarabicCountries = useCallback(async () => {
    const res = await countryApi.getAllArabiccountries();
    SetArabiccountry(res?.payload);
  }, []);

  useEffect(() => {
    getAllarabicCountries();
  }, [getAllarabicCountries]);

  useEffect(() => {
    if (isFocusTab) {
      setDisplayedVideos('general');
    }
  }, [isFocusTab]);

  const startFallingAnimation = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.country_bar_wraper}>
        <TouchableOpacity onPress={startFallingAnimation}>
          <Image source={icons.menu} style={styles.menuIcon} />
        </TouchableOpacity>

        <FlatList
          data={Arabiccountry}
          keyExtractor={(_item, index) => index.toString()}
          windowSize={12}
          maxToRenderPerBatch={12}
          renderItem={({item, index}) => (
            <RenderArabicCountry
              item={item}
              index={index}
              handleImagePress={handleGetCountryVideo}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <CountryModel
        closeModal={closeModal}
        modalVisible={modalVisible}
        getallvideobycountryid={handleGetCountryVideo}
      />

      <View style={styles.nested_container} />
      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : displayedVideos === 'general' ? (
        videos.length > 0 ? (
          <FlatList
            data={videos}
            keyExtractor={(_item, index) => index.toString()}
            windowSize={12}
            maxToRenderPerBatch={12}
            onEndReached={handleGeneralVideoEndReached}
            onEndReachedThreshold={0.2}
            renderItem={({item, index}) => (
              <RenderListItem
                item={item}
                index={index}
                handleImagePress={handleGeneralVideoImagePress}
              />
            )}
            ListHeaderComponent={() => (
              <Text style={styles.header_txt}>{t('General')}</Text>
            )}
            numColumns={3}
          />
        ) : (
          // <View style={styles.loading_container}>{t('Data not found')}</View>
          <View style={styles.loading_container}>
            {/* <Text>Data not found</Text> */}
            <EmptyScreen
              message={t('You are all caught up!')}
              imageSource={icons.videocam}
              imageStyle={{tintColor: '#ccc', width: 50, height: 50}} // Example of overriding styles
            />
          </View>
        )
      ) : countryVideo.length > 0 ? (
        <FlatList
          data={countryVideo}
          numColumns={3}
          keyExtractor={(_item, index) => index.toString()}
          windowSize={12}
          maxToRenderPerBatch={12}
          ListHeaderComponent={() => (
            <Text style={styles.header_txt}>{t('General')}</Text>
          )}
          renderItem={({item, index}) => (
            <RenderListItem
              item={item}
              index={index}
              handleImagePress={handleCountryVideoImagePress}
            />
          )}
        />
      ) : (
        // <View style={styles.loading_container}>{t('Data not found')}</View>
        <View style={styles.loading_container}>
          <Text>{t('Data not found')}</Text>
          <EmptyScreen
            message={t('You are all caught up!')}
            imageSource={icons.videocam}
            imageStyle={{tintColor: '#ccc', width: 50, height: 50}} // Example of overriding styles
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(ListDiscoverVideo);

const styles = StyleSheet.create({
  header_txt: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginHorizontal: 10,
    marginVertical: 2,
  },
  loading_container: {
    width: width,
    height: height,
    alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    top: -250,
  },
  nested_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginLeft: width * 0.02,
  },
  country_bar_wraper: {
    marginLeft: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
  },
});
