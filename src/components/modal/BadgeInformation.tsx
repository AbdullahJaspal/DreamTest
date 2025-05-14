import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import BottomSheet from '../bottomSheets/BottomSheet';
import {BottomSheetRef} from '../bottomSheets/BottomSettingProfile';
import Badge from '../Badge';
import Header from '../../screens/profile/profile/components/Header';
import BadgeRequestModal from './BadgeRequestModal';

import {toggleBadgeModal} from '../../store/slices/common/locationSlice';
import * as BadgerequestApi from '../../apis/badgeRequestApi';

import {AccountType} from '../../enum/accountTypes';
import {UserProfile} from '../../types/UserProfileData';
import {AccountScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {
  selectBadgeType,
  selectMyProfileData,
  selectShowBadgeModal,
} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';

const BadgeInformation: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<AccountScreenNavigationProps>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentBadge, setCurrentBadge] = useState<string>(''); // Current badge state
  const [Loading, setLoading] = useState<boolean>(false);

  const badgeModelSheet = useAppSelector(selectShowBadgeModal);
  const badgeType: AccountType = useAppSelector(selectBadgeType);
  const dispatch = useDispatch();
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const handleSheetClose = () => {
    dispatch(toggleBadgeModal(false));
  };

  const handleBack = () => {
    bottomSheetRef.current?.scrollTo(0);
    dispatch(toggleBadgeModal(false));
  };

  const handleGetVerified = () => {
    // console.log('Redirecting to verification process...');
    navigation.navigate('Verification');
    dispatch(toggleBadgeModal(false));

    // Add navigation or logic to handle verification
  };
  const checkBadgeRequestStatus = () => {
    navigation.navigate('BadgeCheckStatus');
    dispatch(toggleBadgeModal(false));
  };

  // useEffect(() => {
  //   if (badgeModelSheet) {
  //     console.log('open this')
  //     const heightLayout = bottomSheetRef?.current?.heightLayoutCurrent();

  //     bottomSheetRef?.current?.scrollTo(heightLayout ? -heightLayout : 0);
  //     console.log(heightLayout,'heightLayoutheightLayoutheightLayout')
  //   }
  // }, [badgeModelSheet]);
  // useEffect(() => {
  //   if (badgeModelSheet) {
  //     console.log(badgeModelSheet,'badgeModelSheet')
  //     setTimeout(() => {
  //       const heightLayout = bottomSheetRef?.current?.heightLayoutCurrent();
  //       console.log('Height Layout:', heightLayout);
  //       bottomSheetRef?.current?.scrollTo(heightLayout ? -heightLayout : 0);
  //     }, 100);
  //   }
  // }, [badgeModelSheet]);

  const handleRequestBadge = () => {
    setModalVisible(true);
  };

  const createBadgeRequest = async (badgeTypes: string) => {
    // console.log('Badge Requested:', badgeType);

    setLoading(true);
    const token: string = my_data?.auth_token ?? '';
    const data = {
      Badge: badgeTypes,
    };
    console.log(data, 'data badge');
    try {
      const existingBadge = badgeType;

      if (existingBadge === badgeTypes) {
        Toast.show('Already exist this badge.', Toast.LONG);
        setModalVisible(false);
        return;
      }
      const response = await BadgerequestApi.createBadgeRequest(token, data);
      if (response.success) {
        Toast.show(response.message, Toast.LONG);
        setModalVisible(false);
      } else {
        Toast.show(response.message, Toast.LONG);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error submitting badge request:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBadgeContent = () => {
    // alert(badgeType,'badgeType')

    switch (badgeType) {
      case AccountType.SIMPLE_ACCOUNT:
        return (
          <View style={styles.main_container}>
            <Text style={styles.sectionTitle}>About Simple Account</Text>
            <Text style={styles.description}>
              A Simple Account provides access to the core features of our
              platform, allowing users to explore and engage with basic
              functionality. To enjoy more privileges, consider upgrading to a
              verified account.
            </Text>
            <Text style={styles.userDetailsTitle}>Your Account Details</Text>
            <Text style={styles.userDetail}>Name: {my_data?.nickname}</Text>

            {/* <Badge user_data={my_data} /> */}
            <View style={styles.badgeContainer}>
              <Badge user_data={my_data} />

              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    handleRequestBadge();
                    setCurrentBadge('Simple');
                  } else {
                    Toast.show(
                      'You must be verified to request a badge',
                      Toast.LONG,
                    );
                  }
                }}
                // disabled={!my_data?.verified}
              >
                <Text style={styles.applyBadgeButtonText}>Request Badge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    checkBadgeRequestStatus();
                  } else {
                    Toast.show(
                      'You must be verified to Check Status',
                      Toast.LONG,
                    );
                  }
                }}>
                <Text style={styles.applyBadgeButtonText}>Check Status</Text>
              </TouchableOpacity>

              <BadgeRequestModal
                visible={modalVisible}
                currentBadge={currentBadge}
                onClose={() => setModalVisible(false)}
                onSubmit={createBadgeRequest}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !!my_data?.verified && styles.disabledButton,
              ]} // Ensure boolean
              onPress={handleGetVerified}
              disabled={!!my_data?.verified}>
              <Text style={styles.buttonText}>
                {my_data?.verified ? 'Verified' : 'Get Verified'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case AccountType.BUSINESS_ACCOUNT:
        return (
          <View style={styles.main_container}>
            <Text style={styles.sectionTitle}>About Business Account</Text>
            <Text style={styles.description}>
              A Business Account enhances your brand's visibility and trust.
              With access to exclusive analytics and tools, you can grow your
              business and reach a broader audience effectively.
            </Text>
            <Text style={styles.userDetailsTitle}>Your Account Details</Text>
            <Text style={styles.userDetail}>Name: {my_data?.nickname}</Text>
            {/* <Badge user_data={my_data} /> */}
            <View style={styles.badgeContainer}>
              <Badge user_data={my_data} />

              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    // Check if verified
                    handleRequestBadge();
                    setCurrentBadge('Business Account');
                  } else {
                    Toast.show(
                      'You must be verified to request a badge',
                      Toast.LONG,
                    );
                  }
                }}
                // disabled={!my_data?.verified}
              >
                <Text style={styles.applyBadgeButtonText}>Request Badge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    checkBadgeRequestStatus();
                  } else {
                    Toast.show(
                      'You must be verified to Check Status',
                      Toast.LONG,
                    );
                  }
                }}>
                <Text style={styles.applyBadgeButtonText}>Check Status</Text>
              </TouchableOpacity>

              <BadgeRequestModal
                visible={modalVisible}
                currentBadge={currentBadge}
                onClose={() => setModalVisible(false)}
                onSubmit={createBadgeRequest}
              />
            </View>

            <TouchableOpacity
              // style={styles.button}
              style={[
                styles.button,
                !!my_data?.verified && styles.disabledButton,
              ]} // Ensure boolean
              disabled={!!my_data?.verified}
              onPress={handleGetVerified}>
              <Text style={styles.buttonText}>
                {my_data?.verified ? 'Verified' : 'Get Verified'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case AccountType.PREMIUM_ACCOUNT:
        return (
          <View style={styles.main_container}>
            <Text style={styles.sectionTitle}>About Premium Account</Text>
            <Text style={styles.description}>
              A Premium Account provides you with an elevated experience,
              including ad-free browsing, exclusive features, and a premium
              badge that distinguishes you in the community.
            </Text>
            <Text style={styles.userDetailsTitle}>Your Account Details</Text>
            <Text style={styles.userDetail}>Name: {my_data?.nickname}</Text>
            {/* <Badge user_data={my_data} /> */}
            <View style={styles.badgeContainer}>
              <Badge user_data={my_data} />

              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    // Check if verified
                    handleRequestBadge();
                    setCurrentBadge('Premium Users');
                  } else {
                    Toast.show(
                      'You must be verified to request a badge',
                      Toast.LONG,
                    );
                  }
                }}
                // disabled={!my_data?.verified}
              >
                <Text style={styles.applyBadgeButtonText}>Request Badge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    checkBadgeRequestStatus();
                  } else {
                    Toast.show(
                      'You must be verified to Check Status',
                      Toast.LONG,
                    );
                  }
                }}>
                <Text style={styles.applyBadgeButtonText}>Check Status</Text>
              </TouchableOpacity>

              <BadgeRequestModal
                visible={modalVisible}
                currentBadge={currentBadge}
                onClose={() => setModalVisible(false)}
                onSubmit={createBadgeRequest}
              />
            </View>
            <TouchableOpacity
              // style={styles.button}
              style={[
                styles.button,
                !!my_data?.verified && styles.disabledButton,
              ]} // Ensure boolean
              disabled={!!my_data?.verified}
              onPress={handleGetVerified}>
              <Text style={styles.buttonText}>
                {my_data?.verified ? 'Verified' : 'Get Verified'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case AccountType.TOP_ONE_ACCOUNT:
        return (
          <View style={styles.main_container}>
            <Text style={styles.sectionTitle}>
              About Verified Top 1 Account
            </Text>
            <Text style={styles.description}>
              The Verified Top 1 Account represents the pinnacle of achievement
              on our platform. Users with this account type enjoy unparalleled
              recognition, exclusive opportunities, and access to high-level
              community features.
            </Text>
            <Text style={styles.userDetailsTitle}>Your Account Details</Text>
            <Text style={styles.userDetail}>Name: {my_data?.nickname}</Text>
            {/* <Badge user_data={my_data} /> */}
            <View style={styles.badgeContainer}>
              <Badge user_data={my_data} />

              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    // Check if verified
                    handleRequestBadge();
                    setCurrentBadge('Verified Top 1');
                  } else {
                    Toast.show(
                      'You must be verified to request a badge',
                      Toast.LONG,
                    );
                  }
                }}
                // disabled={!my_data?.verified}
              >
                <Text style={styles.applyBadgeButtonText}>Request Badge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyBadgeButton,
                  my_data?.verified ? {} : styles.disabledButton,
                ]}
                onPress={() => {
                  if (my_data?.verified) {
                    checkBadgeRequestStatus();
                  } else {
                    Toast.show(
                      'You must be verified to Check Status',
                      Toast.LONG,
                    );
                  }
                }}>
                <Text style={styles.applyBadgeButtonText}>Check Status</Text>
              </TouchableOpacity>

              <BadgeRequestModal
                visible={modalVisible}
                currentBadge={currentBadge}
                onClose={() => setModalVisible(false)}
                onSubmit={createBadgeRequest}
              />
            </View>
            <TouchableOpacity
              //  style={styles.button}
              style={[
                styles.button,
                !!my_data?.verified && styles.disabledButton,
              ]} // Ensure boolean
              disabled={!!my_data?.verified}
              onPress={handleGetVerified}>
              {/* <Text style={styles.buttonText}>Get Verified</Text>
               */}
              <Text style={styles.buttonText}>
                {my_data?.verified ? 'Verified' : 'Get Verified'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case AccountType.AGENT_ACCOUNT:
        return (
          <View style={styles.main_container}>
            <Text style={styles.sectionTitle}>About Agent Account</Text>
            <Text style={styles.description}>
              An Agent Account provides special privileges and tools for
              managing, assisting, and coordinating activities on behalf of
              other users or organizations. Agents play a crucial role in our
              ecosystem by facilitating smooth operations and engagement.
            </Text>
            <Text style={styles.userDetailsTitle}>Your Account Details</Text>
            <Text style={styles.userDetail}>Name: {my_data?.nickname}</Text>
            {/* <Badge user_data={my_data} /> */}
            <View style={styles.badgeContainer}>
              {/* <Badge user_data={my_data} /> */}
              <View style={styles.badgeContainer}>
                <Badge user_data={my_data} />

                <TouchableOpacity
                  style={[
                    styles.applyBadgeButton,
                    my_data?.verified ? {} : styles.disabledButton,
                  ]}
                  onPress={() => {
                    if (my_data?.verified) {
                      // Check if verified
                      handleRequestBadge();
                      setCurrentBadge('Agent');
                    } else {
                      Toast.show(
                        'You must be verified to request a badge',
                        Toast.LONG,
                      );
                    }
                  }}
                  // disabled={!my_data?.verified}
                >
                  <Text style={styles.applyBadgeButtonText}>Request Badge</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.applyBadgeButton,
                    my_data?.verified ? {} : styles.disabledButton,
                  ]}
                  onPress={() => {
                    if (my_data?.verified) {
                      checkBadgeRequestStatus();
                    } else {
                      Toast.show(
                        'You must be verified to Check Status',
                        Toast.LONG,
                      );
                    }
                  }}>
                  <Text style={styles.applyBadgeButtonText}>Check Status</Text>
                </TouchableOpacity>

                <BadgeRequestModal
                  visible={modalVisible}
                  currentBadge={currentBadge}
                  onClose={() => setModalVisible(false)}
                  onSubmit={createBadgeRequest}
                />
              </View>
            </View>
            <TouchableOpacity
              // style={styles.button}
              style={[
                styles.button,
                !!my_data?.verified && styles.disabledButton,
              ]} // Ensure boolean
              disabled={!!my_data?.verified}
              onPress={handleGetVerified}>
              {/* <Text style={styles.buttonText}>Get Verified</Text> */}
              <Text style={styles.buttonText}>
                {my_data?.verified ? 'Verified' : 'Get Verified'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  if (!badgeModelSheet) {
    return null;
  }

  return (
    <BottomSheet ref={bottomSheetRef} onCloseBottomSheet={handleSheetClose}>
      <Header headertext={'Account Information'} backPress={handleBack} />
      <View style={styles.container}>{renderBadgeContent()}</View>
    </BottomSheet>
  );
};

export default React.memo(BadgeInformation);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
  },
  userDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  userDetail: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  button: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  main_container: {
    flex: 1,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#2c8f27',
  },

  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  applyBadgeButton: {
    marginLeft: 8,
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  applyBadgeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
