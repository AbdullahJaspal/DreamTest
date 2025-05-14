import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign.js';
import {Switch} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import {setMyPrivacy} from '../../../../store/slices/user/privacySlice';
import {useDispatch} from 'react-redux';
import {debounce} from '../../../../utils/debounce';
import {useAppSelector} from '../../../../store/hooks';
import * as user_privacy from '../../../../apis/user_privacy';
import {
  selectCommentEnabled,
  selectLocationHidden,
  selectMyProfileData,
  selectScreenshotAllowed,
  selectSavePostAllowed,
  selectDuetAllowed,
  selectDontRecommendToFriends,
} from '../../../../store/selectors';

const PrivacyPolicy: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const switchUpdateHideLocation = useAppSelector(selectLocationHidden);
  const commentsEnabled = useAppSelector(selectCommentEnabled);
  const screenshotsAllowed = useAppSelector(selectScreenshotAllowed);
  const postSavingAllowed = useAppSelector(selectSavePostAllowed);
  const duetsAllowed = useAppSelector(selectDuetAllowed);
  const friendRecommendationsOff = useAppSelector(selectDontRecommendToFriends);

  const [privacySettings, setPrivacySettings] = useState(null);
  const [switchStates, setSwitchStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isUpdating, setIsUpdating] = useState({});

  useEffect(() => {
    if (privacySettings) {
      setSwitchStates([
        privacySettings.hide_location_in_profile ?? switchUpdateHideLocation,
        privacySettings.dont_recommened_me_to_my_friends ??
          friendRecommendationsOff,
        false,
        privacySettings.enable_other_to_duet_with_my_videos ?? duetsAllowed,
        privacySettings.enable_other_to_save_my_post ?? postSavingAllowed,
        privacySettings.enable_other_to_comment_on_my_post ?? commentsEnabled,
        privacySettings.allow_screenshot_or_screen_recording_of_my_content ??
          screenshotsAllowed,
        false,
      ]);
    }
  }, [privacySettings]);

  const onToggleSwitch = (index: number) => {
    // Prevent multiple calls while updating
    if (isUpdating[index]) {
      console.log(`Already updating switch ${index}, ignoring toggle`);
      return;
    }

    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);

    setIsUpdating(prev => ({...prev, [index]: true}));

    switch (index) {
      case 0:
        handleHideLocation(newSwitchStates[index]);
        break;
      case 1:
        handleDontRecommendMeToMyFriends(newSwitchStates[index]);
        break;
      case 3:
        handleEnableOtherToDuetWithMyVideos(newSwitchStates[index]);
        break;
      case 4:
        handleEnableOtherToSaveMyPost(newSwitchStates[index]);
        break;
      case 5:
        handleCommentDisable(newSwitchStates[index]);
        break;
      case 6:
        handleAllowScreenshotOrScreenRecording(newSwitchStates[index]);
        break;
    }
  };

  const my_data = useAppSelector(selectMyProfileData);

  const handleCommentDisable = useCallback(
    async newState => {
      try {
        console.log(
          'Calling updateUserCommentEnableAndDisable with:',
          newState,
        );

        const Response = await user_privacy.updateUserCommentEnableAndDisable(
          my_data?.auth_token,
          newState,
        );

        console.log(
          'updateUserCommentEnableAndDisable full response:',
          Response,
        );
        console.log('Response success:', Response?.success);
        console.log('Response message:', Response?.message);
        console.log('Response data:', Response?.data);

        if (Response?.data && Response?.success) {
          const updatedValue = Response.data.enable_other_to_comment_on_my_post;
          console.log('Updating comment state to:', updatedValue);

          dispatch(
            setMyPrivacy({
              index: 5,
              value: updatedValue,
            }),
          );

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[5] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 5, value: newState}));
        }
      } catch (error) {
        console.error('Error updating comment settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[5] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [5]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  const handleHideLocation = useCallback(
    async newState => {
      try {
        console.log('Calling updateHideLocationInProfile with:', newState);

        const response = await user_privacy.updateHideLocationInProfile(
          my_data?.auth_token,
          newState,
        );

        console.log('updateHideLocationInProfile full response:', response);
        console.log('Response success:', response?.success);
        console.log('Response message:', response?.message);
        console.log('Response data:', response?.data);

        if (response?.data && response?.success) {
          const updatedValue = response.data.hide_location_in_profile;
          console.log('Updating location state to:', updatedValue);

          dispatch(setMyPrivacy({index: 0, value: updatedValue}));

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[0] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 0, value: newState}));
        }
      } catch (error) {
        console.error('Error updating location settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[0] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [0]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  const handleAllowScreenshotOrScreenRecording = useCallback(
    async newState => {
      try {
        console.log(
          'Calling updateAllowScreenshotOrScreenRecording with:',
          newState,
        );

        const Response =
          await user_privacy.updateAllowScreenshotOrScreenRecording(
            my_data?.auth_token,
            newState,
          );

        console.log(
          'updateAllowScreenshotOrScreenRecording full response:',
          Response,
        );
        console.log('Response success:', Response?.success);
        console.log('Response message:', Response?.message);
        console.log('Response data:', Response?.data);

        if (Response?.data && Response?.success) {
          const updatedValue =
            Response.data.allow_screenshot_or_screen_recording_of_my_content;
          console.log('Updating screenshot state to:', updatedValue);

          dispatch(setMyPrivacy({index: 6, value: updatedValue}));

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[6] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 6, value: newState}));
        }
      } catch (error) {
        console.error('Error updating screenshot settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[6] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [6]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  const handleEnableOtherToSaveMyPost = useCallback(
    async newState => {
      try {
        console.log('Calling updateEnableOtherToSaveMyPost with:', newState);

        const Response = await user_privacy.updateEnableOtherToSaveMyPost(
          my_data?.auth_token,
          newState,
        );

        console.log('updateEnableOtherToSaveMyPost full response:', Response);
        console.log('Response success:', Response?.success);
        console.log('Response message:', Response?.message);
        console.log('Response data:', Response?.data);

        if (Response?.data && Response?.success) {
          const updatedValue = Response.data.enable_other_to_save_my_post;
          console.log('Updating save post state to:', updatedValue);

          dispatch(
            setMyPrivacy({
              index: 4,
              value: updatedValue,
            }),
          );

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[4] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 4, value: newState}));
        }
      } catch (error) {
        console.error('Error updating save post settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[4] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [4]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  const handleEnableOtherToDuetWithMyVideos = useCallback(
    async newState => {
      try {
        console.log(
          'Calling updateEnableOtherToDuetWithMyVideos with:',
          newState,
        );

        const Response = await user_privacy.updateEnableOtherToDuetWithMyVideos(
          my_data?.auth_token,
          newState,
        );

        console.log(
          'updateEnableOtherToDuetWithMyVideos full response:',
          Response,
        );
        console.log('Response success:', Response?.success);
        console.log('Response message:', Response?.message);
        console.log('Response data:', Response?.data);

        if (Response?.data && Response?.success) {
          const updatedValue =
            Response.data.enable_other_to_duet_with_my_videos;
          console.log('Updating duet state to:', updatedValue);

          dispatch(
            setMyPrivacy({
              index: 3,
              value: updatedValue,
            }),
          );

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[3] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 3, value: newState}));
        }
      } catch (error) {
        console.error('Error updating duet settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[3] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [3]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  const handleDontRecommendMeToMyFriends = useCallback(
    async newState => {
      try {
        console.log('Calling updateDontRecommendMeToMyFriends with:', newState);

        const response = await user_privacy.updateDontRecommendMeToMyFriends(
          my_data?.auth_token,
          newState,
        );

        console.log(
          'updateDontRecommendMeToMyFriends full response:',
          response,
        );
        console.log('Response success:', response?.success);
        console.log('Response message:', response?.message);
        console.log('Response data:', response?.data);

        if (response?.data && response?.success) {
          const updatedValue = response.data.dont_recommened_me_to_my_friends;
          console.log('Updating friend recommendation state to:', updatedValue);

          dispatch(
            setMyPrivacy({
              index: 1,
              value: updatedValue,
            }),
          );

          // Update local state to match server response
          setSwitchStates(prev => {
            const newStates = [...prev];
            newStates[1] = updatedValue;
            return newStates;
          });
        } else {
          console.log(
            'No data in response or not successful, using:',
            newState,
          );
          dispatch(setMyPrivacy({index: 1, value: newState}));
        }
      } catch (error) {
        console.error('Error updating friend recommendation settings:', error);
        // Revert on error
        setSwitchStates(prev => {
          const newStates = [...prev];
          newStates[1] = !newState;
          return newStates;
        });
      } finally {
        setIsUpdating(prev => ({...prev, [1]: false}));
      }
    },
    [dispatch, my_data?.auth_token],
  );

  // ****** Get All Privacy Detail *******
  const fetchUserPrivacyDetail = useCallback(async () => {
    try {
      console.log('Fetching user privacy details...');

      const Response = await user_privacy.getUserPrivacyDetail(
        my_data?.auth_token,
      );

      console.log('getUserPrivacyDetail full response:', Response);
      console.log('Response success:', Response?.success);
      console.log('Response message:', Response?.message);
      console.log('Response data:', Response?.data);

      if (Response?.data && Response?.success) {
        setPrivacySettings(Response.data);
        console.log('Privacy settings updated with:', Response.data);
      } else {
        console.log('Failed to fetch privacy details or no data');
      }
    } catch (error) {
      console.error('Error fetching privacy details:', error);
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchUserPrivacyDetail();
  }, [fetchUserPrivacyDetail]);

  return (
    <View style={styles.main_conatainer}>
      <Header headertext={t('Privacy')} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Navigation Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate('Userblocked')}
            activeOpacity={0.7}>
            <View style={styles.navigationContent}>
              <Text style={styles.navigationText}>{t('User Blocked me')}</Text>
              <AntDesign name="right" color="#666" size={18} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => navigation.navigate('Messageme')}
            activeOpacity={0.7}>
            <View style={styles.navigationContent}>
              <Text style={styles.navigationText}>
                {t('Who can message me')}
              </Text>
              <AntDesign name="right" color="#666" size={18} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navigationItem, styles.lastNavigationItem]}
            onPress={() => navigation.navigate('Viewlist')}
            activeOpacity={0.7}>
            <View style={styles.navigationContent}>
              <Text style={styles.navigationText}>
                {t('Who can view my like list')}
              </Text>
              <AntDesign name="right" color="#666" size={18} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('Privacy Settings')}</Text>

          {/* Hide Location Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t('Hide location in Profile')}
              </Text>
              <Switch
                value={switchStates[0]}
                onValueChange={() => onToggleSwitch(0)}
                color="#ed2415"
                disabled={isUpdating[0]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t(
                'Once turned on, your location will be hidden in your Profile.',
              )}
            </Text>
          </View>

          {/* Don't Recommend to Friends */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t("Don't recommend me to my friends")}
              </Text>
              <Switch
                value={switchStates[1]}
                onValueChange={() => onToggleSwitch(1)}
                color="#ed2415"
                disabled={isUpdating[1]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t(
                "Once turned on, you won't be recommended to your Facebook friends and mobile contacts.",
              )}
            </Text>
          </View>

          {/* Don't Recommend LIVE */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t("Don't recommend my LIVE to friends")}
                {'\n'}
                {t('in the live')}
              </Text>
              <Switch
                value={switchStates[2]}
                onValueChange={() => onToggleSwitch(2)}
                color="#ed2415"
                disabled={isUpdating[2]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t(
                'Once turned on, your LIVE sessions will not be recommend to your Facebook friends',
              )}
            </Text>
          </View>

          {/* Content Interaction Settings */}
          <Text style={styles.subsectionTitle}>
            {t('Content Interactions')}
          </Text>

          {/* Duet Settings */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t('Enable others to Duet with my videos')}
              </Text>
              <Switch
                value={switchStates[3]}
                onValueChange={() => onToggleSwitch(3)}
                color="#ed2415"
                disabled={isUpdating[3]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t('When disabled, others cannot Duet with your videos.')}
            </Text>
          </View>

          {/* Save Posts Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t('Enable others to save my posts')}
              </Text>
              <Switch
                value={switchStates[4]}
                onValueChange={() => onToggleSwitch(4)}
                color="#ed2415"
                disabled={isUpdating[4]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t('When disabled, others cannot save your posts.')}
            </Text>
          </View>

          {/* Comments Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t('Enable others to comment on my posts')}
              </Text>
              <Switch
                value={switchStates[5]}
                onValueChange={() => onToggleSwitch(5)}
                color="#ed2415"
                disabled={isUpdating[5]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t('When disabled, others cannot comment on your posts')}
            </Text>
          </View>

          {/* Live Content Settings */}
          <Text style={styles.subsectionTitle}>{t('Live Content')}</Text>

          {/* Screenshot Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                {t('Allow screenshots or screen recording of my live content')}
              </Text>
              <Switch
                value={switchStates[6]}
                onValueChange={() => onToggleSwitch(6)}
                color="#ed2415"
                disabled={isUpdating[6]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t(
                'After closing, others cannot take screenshots or record any of your live content',
              )}
            </Text>
          </View>

          {/* LINE Status Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>
                Allow to set my LINE status public
              </Text>
              <Switch
                value={switchStates[7]}
                onValueChange={() => onToggleSwitch(7)}
                color="#ed2415"
                disabled={isUpdating[7]}
              />
            </View>
            <Text style={styles.settingDescription}>
              {t(
                'After close, nobody can know your LINE status outside the LIVE room',
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  main_conatainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastNavigationItem: {
    borderBottomWidth: 0,
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  settingsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: 'Roboto',
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: 'Roboto',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
    fontFamily: 'Roboto',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Roboto',
  },
});
