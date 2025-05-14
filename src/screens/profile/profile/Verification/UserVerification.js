import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  ImageStyle,
} from 'react-native';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';

const {width, height} = Dimensions.get('screen');
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const UserVerification = () => {
  const {t, i18n} = useTranslation();

  const verificationrequest = require('../../../../apis/Verificationrequestfromuserside');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [isProfileLinkValid, setIsProfileLinkValid] = useState(false);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(t('Simple Account'));

  const navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);

  const BADGE_OPTIONS = [
    {label: t('Simple'), icon: icons.simpleVerification, iconSize: 20},
    {
      label: t('Business Account'),
      icon: icons.businessVerification,
      iconSize: 22,
    },
    {label: t('Premium Users'), icon: icons.premiumVerification, iconSize: 22},
    {label: t('Verified Top 1'), icon: icons.verification, iconSize: 25},
    {label: t('Agent'), icon: icons.agentVerification, iconSize: 22},
  ];

  const validateURL = text => {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlRegex.test(text.trim());
  };

  const handleProfileLinkChange = text => {
    setProfileLink(text);
    setIsProfileLinkValid(text.trim().length > 0 && validateURL(text));
  };

  const handleApplyVerification = async () => {
    if (!isProfileLinkValid) {
      setAlertMessage(t('Error: Please enter a valid profile link.'));
      setAlertVisible(true);
      return;
    }
    const data = {
      userId: my_data.id,
      profileLink: profileLink,
      badge: selectedBadge,
    };
    // console.log(data, 'data badge');
    try {
      const response = await verificationrequest.SendverificationRequest(
        my_data?.auth_token,
        data,
      );
      if (response.success) {
        setAlertMessage(t('Verification Request sent successfully'));
      } else {
        setAlertMessage(
          response.message || 'Failed to send verification request',
        );
      }
      setAlertVisible(true);
      setProfileLink('');
    } catch (error) {
      console.error('Error occurred:', error);
      setAlertMessage('An error occurred while sending your request.');
      setAlertVisible(true);
    }
  };

  const CustomAlert = ({visible, message, onClose}) => {
    return (
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.modalOverlayalert}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertMessage}>{message}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={onClose}>
              <Text style={styles.alertButtonText}>{t('OK')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const BadgeSelectionModal = () => {
    return (
      <Modal
        transparent={true}
        visible={badgeModalVisible}
        animationType="slide"
        onRequestClose={() => setBadgeModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setBadgeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.badgeModalContainer}>
              <Text style={styles.modalTitle}>{t('Select a Badge')}</Text>

              <FlatList
                data={BADGE_OPTIONS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.badgeOption,
                      selectedBadge === item.label && styles.selectedBadge,
                    ]}
                    onPress={() => {
                      setSelectedBadge(item.label);
                      setBadgeModalVisible(false);
                    }}>
                    <FastImage
                      source={item.icon}
                      style={[
                        styles.badgeIcon,
                        {width: item.iconSize, height: item.iconSize},
                      ]}
                    />
                    <Text
                      style={[
                        styles.badgeText,
                        selectedBadge === item.label &&
                          styles.selectedBadgeText,
                      ]}>
                      {t(item.label)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main_container}>
          <Header headertext={t('Verification')} />
          <ScrollView contentContainerStyle={styles.scroll_container}>
            <View style={styles.content_container}>
              <Image source={icons.dreamLogo} style={styles.image} />
              <Text style={styles.title_text}>{t('Verification Details')}</Text>
              <Text style={styles.verification_text}>
                {t(
                  'Meet the following requirements to be recognized as a Dream Creator and pass verification',
                )}
                :
              </Text>
              <View style={styles.criteria_list}>
                <View style={styles.criteria_item}>
                  <Image source={icons.star} style={styles.icon} />
                  <Text style={styles.criteria_text}>
                    {t('You must have at least 5 followers.')}
                  </Text>
                </View>
                <View style={styles.criteria_item}>
                  <Image source={icons.star} style={styles.icon} />
                  <Text style={styles.criteria_text}>
                    {t('You must have posted over 5 videos.')}
                  </Text>
                </View>
                <View style={styles.criteria_item}>
                  <Image source={icons.star} style={styles.icon} />
                  <Text style={styles.criteria_text}>
                    {t(
                      'If you are famous on another platform, share your profile link',
                    )}{' '}
                    (e.g., YouTube, Instagram, Wikipedia, etc.).
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    !isProfileLinkValid &&
                      profileLink.length > 0 &&
                      styles.inputError,
                  ]}
                  placeholder={t('Enter your profile link')}
                  onChangeText={handleProfileLinkChange}
                  value={profileLink}
                />
                {profileLink.trim().length > 0 && !isProfileLinkValid && (
                  <Text style={styles.errorText}>
                    {t('Please enter a valid profile link.')}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.badgeButton}
                  onPress={() => setBadgeModalVisible(true)}>
                  <Text style={styles.badgeButtonText}>
                    {t('Request Badge')}: {selectedBadge}
                  </Text>
                </TouchableOpacity>
                <BadgeSelectionModal />
              </View>
              <TouchableOpacity
                style={[
                  styles.apply_button,
                  (!isProfileLinkValid || profileLink.trim().length === 0) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleApplyVerification}
                disabled={
                  !isProfileLinkValid || profileLink.trim().length === 0
                }>
                <Text style={styles.button_text}>
                  {t('Apply for Verification')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <CustomAlert
            visible={alertVisible}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UserVerification;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  scroll_container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  content_container: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title_text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  verification_text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  criteria_list: {
    width: '100%',
    marginBottom: 30,
  },
  criteria_item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  criteria_text: {
    fontSize: 15,
    color: '#333',
  },
  apply_button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // top: -10,
  },
  modalOverlayalert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: -17,
  },
  alertContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  badgeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 15,
    borderRadius: 5,
  },
  badgeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  badgeModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 10,
  },

  selectedBadge: {
    backgroundColor: '#ddd',
  },
  selectedBadgeText: {
    fontWeight: 'bold',
  },

  badgeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  badgeIcon: {
    // width: 25,
    // height: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  badgeText: {
    fontSize: 16,
    color: '#333',
  },
  // selectedBadge: {
  //   backgroundColor: '#e6f7ff',
  // },
  // selectedBadgeText: {
  //   color: '#007aff',
  //   fontWeight: 'bold',
  // },
});
