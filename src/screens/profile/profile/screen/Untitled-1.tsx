import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  TouchableHighlight,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
const PurchaseCoins = require('../../../../../apis/Gift_Information_Record');

const {width, height} = Dimensions.get('screen');

interface Transaction {
  createdAt: string;
  diamonds: number;
  dimanond_value: number;
}

interface TypeData {
  commentRoses?: Transaction[];
  gifts?: Transaction[];
  messageSubscriptions?: Transaction[];
  transactions?: Transaction[];
}

const GiftInformation: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('All Types');
  const [typeData, setTypeData] = useState<TypeData | null>(null);

  const apiEndpoints: Record<string, () => Promise<any>> = {
    'Dream Rewards': PurchaseCoins.getDreamRewards,
    Withdrawal: PurchaseCoins.getWithdrawal,
    'Rewards from Live': PurchaseCoins.getRewardsFromLive,
    'Buy Gifts for a Friend': PurchaseCoins.getRewardFromRose,
    'Rewards from Video': PurchaseCoins.getRewardFromVideo,
    'Rewards from message': PurchaseCoins.getRewardFromMessage,
    'Rewards from Campaigns': PurchaseCoins.getRewardsFromCampaigns,
    'Purchase Coins': PurchaseCoins.getPurchaseCoins,
  };

  useEffect(() => {
    const fetchAllTypesData = async () => {
      try {
        setModalVisible(false);
        const response = await PurchaseCoins.getAllRewards();
        console.log(response, 'getAllRewards');
        setTypeData(response);
      } catch (error) {
        console.error('Error fetching All Types data:', error);
      }
    };

    fetchAllTypesData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiEndpoints[selectedType]();
        setTypeData(response);
      } catch (error) {
        console.error(`Error fetching ${selectedType} data:`, error);
      }
    };

    if (selectedType !== 'All Types') {
      fetchData();
    }
  }, [selectedType]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOverlayPress = () => {
    closeModal();
  };

  const formatCreatedAt = (timestamp: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(
      new Date(timestamp),
    );
  };

  const renderData = () => {
    if (!typeData) {
      return <Text>No data available</Text>;
    }

    switch (selectedType) {
      case 'Dream Rewards':
        return (
          <ScrollView>
            <Text>Data for Dream Rewards:</Text>
            {typeData.commentRoses?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${item.diamonds}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Withdrawal':
        return (
          <ScrollView>
            <Text>Data for Withdrawal:</Text>
            {typeData.transactions?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.diamonds
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Rewards from Live':
        return (
          <ScrollView>
            <Text>Data for Rewards from Live:</Text>
            {typeData.transactions?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.diamonds
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Rewards from message':
        return (
          <ScrollView>
            <Text>Data for Rewards from message:</Text>
            {typeData.messageSubscriptions?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.diamonds
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Rewards from Video':
        return (
          <ScrollView>
            <Text>Data for Rewards from Video:</Text>
            {typeData.gifts?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.diamonds
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Purchase Coins':
        return (
          <ScrollView>
            <Text>Data for Purchase Coins:</Text>
            {typeData.transactions?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.dimanond_value
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      case 'Buy Gifts for a Friend':
        return (
          <ScrollView>
            <Text>Data for Buy Gifts for a Friend:</Text>
            {typeData.commentRoses?.map(item => (
              <Text key={item.createdAt}>{`Diamonds: ${
                item.diamonds
              }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.main_container}>
      <TouchableOpacity style={styles.alltypes} onPress={openModal}>
        <Text style={styles.txt}>{selectedType}</Text>
        <AntDesign name="caretdown" size={15} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={handleOverlayPress}
          />
          <View style={styles.modalContent}>
            <Text style={{alignSelf: 'center', margin: 15}}>Choose type</Text>
            {Object.keys(apiEndpoints).map(type => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedType(type);
                  closeModal();
                }}>
                <Text style={styles.modalItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableHighlight
              style={styles.cancelButton}
              onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      {selectedType === 'All Types' && typeData && (
        <ScrollView>
          <Text>Data for Comment Roses:</Text>
          {typeData.commentRoses?.map(item => (
            <Text key={item.createdAt}>{`Diamonds: ${
              item.diamonds
            }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
          ))}

          <Text>Data for Gifts:</Text>
          {typeData.gifts?.map(item => (
            <Text key={item.createdAt}>{`Diamonds: ${
              item.diamonds
            }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
          ))}

          <Text>Data for Message Subscriptions:</Text>
          {typeData.messageSubscriptions?.map(item => (
            <Text key={item.createdAt}>{`No. of Diamonds: ${
              item.diamonds
            }, Created At: ${formatCreatedAt(item.createdAt)}`}</Text>
          ))}

          <Text>Data for Transactions:</Text>
          {typeData.transactions?.map(item => (
            <Text
              key={
                item.createdAt
              }>{`Diamond Value: ${item.dimanond_value}`}</Text>
          ))}
        </ScrollView>
      )}

      <View>{renderData()}</View>
    </View>
  );
};

export default GiftInformation;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  alltypes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.04,
  },
  txt: {
    padding: 5,
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalItem: {
    padding: 10,
  },
  modalItemText: {
    fontSize: 18,
    color: 'black',
  },
  cancelButton: {
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
  },
});
