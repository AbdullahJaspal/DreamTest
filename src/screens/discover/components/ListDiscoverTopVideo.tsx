import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RenderListItem from './RenderListItem';
import * as countryApi from '../../../apis/countryApi';
import CountryModel from './CountryModel';
import RenderArabicCountry from './RenderArabicCountry';
import {
  CountryProps,
  CountrySelectionProps,
  SearchVideoProps,
} from '../types/CountrySelection';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getItemLayout} from '../../../utils/videoItemLayout';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../assets/icons';

interface ListDiscoverVideoProps {
  videos: SearchVideoProps[];
  loading: boolean;
  setLoading: any;
  countryVideos: SearchVideoProps[];
  reachedVideoEnd: () => void;
  getSelectedCountryVideos: (countryID: number) => void;
  handleImagePress: (index: number, video_id: number) => void;
  handleCountryImagePress: (
    index: number,
    video_id: number,
    country_id: number,
  ) => void;
}

const {width, height} = Dimensions.get('screen');
const ListDiscoverTopVideo: React.FC<ListDiscoverVideoProps> = ({
  videos,
  loading,
  setLoading,
  countryVideos,
  reachedVideoEnd,
  getSelectedCountryVideos,
  handleCountryImagePress,
  handleImagePress,
}) => {
  const {t, i18n} = useTranslation();

  const [selectedCountry, setSelectedCountry] =
    useState<CountrySelectionProps>();
  const [Arabiccountry, setArabiccountry] = useState<CountryProps[]>([]);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const flatListRef = useRef<FlatList<SearchVideoProps>>(null);

  const getAllarabicCountries = useCallback(async () => {
    const res = await countryApi.getAllArabiccountries();
    setArabiccountry(res?.payload);
  }, []);

  useEffect(() => {
    getAllarabicCountries();
  }, [getAllarabicCountries]);

  const getCountryVideos = async (data: CountrySelectionProps) => {
    setSelectedCountry(data);
    getSelectedCountryVideos(data.country_id);
    setLoading(true);
  };

  const startFallingAnimation = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Custom empty state component
  const EmptyState: React.FC = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyText}>
        {t('No content available at the moment')}.
      </Text>
    </View>
  );

  function handleEndReached(info: {distanceFromEnd: number}): void {
    if (selectedCountry?.country_id) {
      getSelectedCountryVideos(selectedCountry.country_id);
    }
  }

  function handleRefresh(): void {
    if (selectedCountry?.country_id) {
      getSelectedCountryVideos(selectedCountry.country_id);
    }
    reachedVideoEnd();
    setLoading(true);
  }

  const handleCountryVideoPress = (index: number, video_id: number) => {
    if (selectedCountry?.country_id) {
      handleCountryImagePress(index, video_id, selectedCountry?.country_id);
    }
  };

  function handleScrollToTop(event: GestureResponderEvent): void {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index: 0, animated: true});
    }
  }

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
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <RenderArabicCountry
              item={item}
              index={index}
              handleImagePress={getCountryVideos}
            />
          )}
        />
      </View>
      <CountryModel
        closeModal={closeModal}
        modalVisible={modalVisible}
        getallvideobycountryid={getCountryVideos}
      />

      <View style={styles.nested_container} />
      {loading && videos?.length === 0 ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : (
        <>
          <FlatList
            data={videos}
            keyExtractor={(_item, index) => index.toString()}
            windowSize={12}
            ref={flatListRef}
            maxToRenderPerBatch={12}
            initialNumToRender={3}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={100}
            getItemLayout={getItemLayout}
            renderItem={({item, index}) => (
              <RenderListItem
                item={item}
                index={index}
                handleImagePress={handleImagePress}
              />
            )}
            ListHeaderComponent={() => (
              <>
                {selectedCountry?.country_name && (
                  <FlatList
                    data={countryVideos}
                    keyExtractor={(_item, index) => index.toString()}
                    windowSize={12}
                    maxToRenderPerBatch={12}
                    initialNumToRender={3}
                    removeClippedSubviews={true}
                    updateCellsBatchingPeriod={100}
                    getItemLayout={getItemLayout}
                    renderItem={({item, index}) => (
                      <RenderListItem
                        item={item}
                        index={index}
                        handleImagePress={handleCountryVideoPress}
                      />
                    )}
                    ListHeaderComponent={() => (
                      <View style={styles.headerContainer}>
                        <Text style={styles.header_txt}>
                          {t('Country')}: {selectedCountry?.country_name}
                        </Text>
                        {selectedCountry.country_id && (
                          <TouchableOpacity
                            onPress={() => setSelectedCountry(undefined)}>
                            <Text style={styles.crossText}>X</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    ListEmptyComponent={<EmptyState />}
                    numColumns={3}
                    // onEndReached={handleEndReached}
                  />
                )}
                <Text style={styles.header_txt}>{t('General')}</Text>
              </>
            )}
            ListEmptyComponent={loading ? null : <EmptyState />}
            numColumns={3}
            onRefresh={handleRefresh}
            refreshing={loading}
            scrollsToTop={true}
            ListFooterComponent={
              <Text style={styles.no_more_txt}>
                {t('No more content found')}
              </Text>
            }
          />
        </>
      )}
      {/* <Pressable style={styles.scroll_container} onPress={handleScrollToTop}>
        <AntDesign
          name="doubleright"
          style={{
            transform: [{rotate: '-90deg'}],
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 100,
            padding: 5,
          }}
          color={'#000'}
        />
      </Pressable> */}
    </View>
  );
};

export default ListDiscoverTopVideo;

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
    justifyContent: 'center',
  },
  nested_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  country_bar_wraper: {
    marginLeft: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginLeft: width * 0.02,
  },
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  empty_text: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  crossText: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    left: -14,
  },
  scroll_container: {
    position: 'absolute',
    bottom: 15,
    right: 5,
  },
  no_more_txt: {
    color: '#000',
    marginVertical: 20,
  },
});
