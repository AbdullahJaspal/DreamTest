import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import * as BadgerequestApi from '../../../../apis/badgeRequestApi';
import {Icon} from '../../../../components';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {gifs} from '../../../../assets/gifs';

const {width, height} = Dimensions.get('screen');

const BadgeStatus = () => {
  const navigation = useNavigation();

  const my_data = useAppSelector(selectMyProfileData);
  const [badgeRequests, setBadgeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBadgeRequestStatus = async () => {
    try {
      setLoading(true);

      const response = await BadgerequestApi.getBadgeRequestStatus(
        my_data?.auth_token,
        my_data.id,
      );

      if (response?.success) {
        setBadgeRequests(response.data);
      } else {
        setError(response?.data?.message || 'An error occurred');
      }
    } catch (error) {
      setError('Error occurred while fetching badge requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (my_data?.id) {
      getBadgeRequestStatus();
    }
  }, [my_data]);

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'reject':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#000000';
    }
  };

  const renderBadgeItem = ({item}) => {
    const date = new Date(item.requested_time);
    const formattedDate = date.toLocaleDateString();

    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.idCell]}>{item.id}</Text>
        <Text style={[styles.tableCell, styles.badgeCell]}>
          {item.requested_badge_type}
        </Text>
        <Text style={[styles.tableCell, styles.timeCell]}>{formattedDate}</Text>
        <Text
          style={[
            styles.tableCell,
            styles.statusCell,
            {color: getStatusColor(item.status)},
          ]}>
          {item.status}
        </Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.mainContainer}>
        <Header headertext={'Badge Status'} />

        {loading ? (
          <View style={styles.loader}>
            <Icon source={gifs.tiktokLoader} width={50} height={50} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {badgeRequests.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No status data found</Text>
              </View>
            ) : (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.idCell,
                      styles.headerText,
                    ]}>
                    ID
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.badgeCell,
                      styles.headerText,
                    ]}>
                    Request Badge
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.timeCell,
                      styles.headerText,
                    ]}>
                    Request Date
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.statusCell,
                      styles.headerText,
                    ]}>
                    Status
                  </Text>
                </View>

                <FlatList
                  data={badgeRequests}
                  renderItem={renderBadgeItem}
                  keyExtractor={item => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BadgeStatus;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  scrollContainer: {
    padding: 1,
    flexGrow: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888888',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#d0d0d0',
  },
  tableCell: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    textAlign: 'center',
    paddingVertical: 5,
  },
  idCell: {
    flex: 1,
  },
  badgeCell: {
    flex: 2,
  },
  timeCell: {
    flex: 2,
  },
  statusCell: {
    flex: 1.5,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#555555',
  },
  loader: {
    width: width,
    height: height,
    // backgroundColor: COLOR.BACKGROUND_LOADING,
    backgroundColor: '#ffffff',

    alignItems: 'center',
    justifyContent: 'center',
  },
});
