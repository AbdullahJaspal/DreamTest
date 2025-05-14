import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import Header from '../components/Header';

import Icon from 'react-native-vector-icons/Octicons';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const LuckyWheel = () => {
  const {t, i18n} = useTranslation();

  const WheelLuckApis = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);
  const [wheelData, setWheelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WheelLuckApis.getWheelLuck(my_data?.auth_token);
        // console.log('response', response);

        // Sort the data by the createdAt field in descending order
        const sortedData = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setWheelData(sortedData);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error during download:', error.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.title}>{t('Diamonds')}</Text>
      <Text style={styles.diamonds}>{t(item.diamonds)}</Text>
      <Text style={styles.title}>{t('Ticket No')}</Text>
      <Text style={styles.ticketNo}>{item.ticket_no}</Text>
      <Text style={styles.title}>{t('Date')}</Text>
      <Text style={styles.createdAt}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  // const formatDate = timestamp => {
  //   const date = new Date(timestamp);
  //   return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  // };
  const formatDate = timestamp => {
    const locale = i18n.language || 'en'; // Get the selected language
    const date = new Date(timestamp);

    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    });
  };
  return (
    <View style={styles.container}>
      <Header headertext={t('Lucky Wheel')} />
      {loading ? (
        <ActivityIndicator size="large" color="grey" style={styles.loader} />
      ) : wheelData.length > 0 ? (
        <FlatList
          data={wheelData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Icon
            name="comment-discussion"
            size={100}
            color="#555"
            style={styles.noDataIcon}
          />
          <Text style={styles.noDataText}>{t('No Data Available')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  createdAt: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  diamonds: {
    fontSize: 18,
    color: '#ff8c00',
  },
  ticketNo: {
    fontSize: 14,
    color: '#555',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataIcon: {
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
  },
});

export default LuckyWheel;
