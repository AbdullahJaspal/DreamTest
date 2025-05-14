import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Dimensions,
  StatusBar,
  Platform,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../../store/hooks';
import {selectMyProfileData} from '../../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const GiftInformation: React.FC = () => {
  const {t, i18n} = useTranslation();

  const PurchaseCoins = require('../../../../../apis/Gift_Information_Record');
  const my_data = useAppSelector(selectMyProfileData);
  const [allTypesData, setAllTypesData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(t('All Types'));

  useEffect(() => {
    const fetchAllTypesData = async () => {
      try {
        const user_id = my_data.id;
        const response = await PurchaseCoins.getAllRewards({user_id});
        // console.log(response,"sjdbkdjbksgdhgvkh")
        setAllTypesData(response);
      } catch (error) {
        console.error('Error fetching All Types data:', error);
      }
    };

    fetchAllTypesData();
  }, []);
  const formatDateTime = dateTime => {
    const formattedDateTime = new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return formattedDateTime;
  };

  const organizeDataByMonth = () => {
    if (!allTypesData) return [];

    const organizedData = [];
    const organizeDataForType = (type, data, category) => {
      data.forEach(item => {
        const createdAt = new Date(item.createdAt);
        const monthYear = `${createdAt.toLocaleString('default', {
          month: 'long',
        })} ${createdAt.getFullYear()}`;

        const existingMonthIndex = organizedData.findIndex(
          section => section.title === monthYear,
        );

        if (existingMonthIndex === -1) {
          organizedData.push({
            title: monthYear,
            data: [{type, category, ...item}],
          });
        } else {
          organizedData[existingMonthIndex].data.push({
            type,
            category,
            ...item,
          });
        }
      });
    };

    switch (selectedCategory) {
      case 'Comment Roses':
        organizeDataForType(
          'commentRose',
          allTypesData.commentRoses,
          'Comment Roses',
        );
        break;
      case 'Gifts':
        organizeDataForType('gift', allTypesData.gifts, 'Rewards from video');
        break;
      case 'Message Subscriptions':
        organizeDataForType(
          'messageSubscription',
          allTypesData.messageSubscriptions,
          'Message Subscriptions',
        );
        break;
      case 'Transactions':
        organizeDataForType(
          'transaction',
          allTypesData.transactions,
          'Transactions',
        );
        break;
      case 'Buy Gift For a Friend':
        organizeDataForType(
          'GiftUserFriend',
          allTypesData.GiftUserFriend,
          'Buy Gift For a Friend',
        );
        break;
      case 'Dream Rewards':
        organizeDataForType(
          'GiftAdminUser',
          allTypesData.GiftAdminUser,
          'Dream Rewards',
        );
        break;

      case 'Rewards from live':
        organizeDataForType(
          'GiftAdminUser',
          allTypesData.GiftAdminUser,
          'Rewards from live',
        );
        break;
      default:
        organizeDataForType(
          'commentRose',
          allTypesData.commentRoses,
          'Rewards from  Roses',
        );
        organizeDataForType('gift', allTypesData.gifts, 'Rewards from Video');
        organizeDataForType(
          'messageSubscription',
          allTypesData.messageSubscriptions,
          'Coins from Message',
        );
        organizeDataForType(
          'transaction',
          allTypesData.transactions,
          'Purchase Coins',
        );
        organizeDataForType(
          'GiftUserFriend',
          allTypesData.GiftUserFriend,
          'Buy Gift For a Friend',
        );
        organizeDataForType(
          'GiftAdminUser',
          allTypesData.GiftAdminUser,
          'Dream Rewards',
        );

        organizeDataForType(
          'GiftAdminUser',
          allTypesData.GiftAdminUser,
          'Rewards from live',
        );

        break;
    }

    organizedData.sort((a, b) => new Date(a.title) - new Date(b.title));

    return organizedData.reverse();
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.categoryText}>{` ${t(item.category)}`}</Text>
      <Text style={styles.diamondsText}>{`$ ${(
        item.diamonds / 120 ||
        item.no_of_diamond / 120 ||
        item.dimanond_value / 120 ||
        item.diamond_value / 120
      ).toFixed(2)}`}</Text>

      <Text style={styles.dateTimeText}>{`${formatDateTime(
        item.createdAt,
      )}`}</Text>
    </View>
  );

  const renderSectionHeader = ({section: {title}}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory('All Types');
  };

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      <Octicons name="comment-discussion" size={200} />
      <Text style={styles.noDataText}>{t('No data available.')}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Header headertext={t('Gift Information Record')} />
      <TouchableOpacity
        style={styles.allTypes}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.typeText}>{selectedCategory}</Text>
        <AntDesign name="caretdown" size={15} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('All Types');
                }}>
                <Text style={styles.modalButtonText}>{t('All Types')}</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Dream Rewards');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Dream Rewards')}{' '}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Comment Roses');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Coins from roses')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Gifts');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Rewards from video')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Message Subscriptions');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('coins from Message')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Transactions');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Purchase Coins')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Buy Gift For a Friend');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Buy Gift For a Friend')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  setSelectedCategory('Rewards from live');
                }}>
                <Text style={styles.modalButtonText}>
                  {t('Rewards from live ')}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, {backgroundColor: '#E34827'}]}
                onPress={closeModal}>
                <Text style={styles.modalButtonText}>{t('Cancel')}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {allTypesData ? (
        <SectionList
          style={styles.sectionList}
          sections={organizeDataByMonth()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderNoData}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  allTypes: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  typeText: {
    padding: 5,
    color: 'black',
    fontSize: 16,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  categoryText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  diamondsText: {
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionList: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    position: 'absolute',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    width: width,
    elevation: 5,
    bottom: 0,
    height: height * 0.77,
  },
  modalButton: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#d9d9d9',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'black',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  noDataContainer: {
    marginTop: 20,
    opacity: 0.4,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GiftInformation;
