import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';
import * as userApi from '../../../apis/userApi';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {updateProfile} from '../../../apis/userApi';
import Toast from 'react-native-simple-toast';
import {
  update_nickname,
  update_gender,
  update_bio,
  update_dob,
  update_emotion_state,
  update_person_height,
  update_person_weight,
  update_instagram,
  update_you_tube,
  update_facebook,
  update_twitter,
  update_username,
} from '../../../store/slices/user/my_dataSlice';

import {UserProfile} from '../../../types/UserProfileData';
import {EditProfileScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

import Body from '../../../components/Body/Body.components';
import Header from '../profile/components/Header';
import ChangedInputBox from './components/ChangedInputBox';
import OptionSelector from './components/OptionSelector';

import {formatDateOnly} from '../../../utils/customDate';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';
import DatePicker from 'react-native-date-picker';
import {images} from '../../../assets/images';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('window');

interface ListItem {
  name: string;
  value: string | number | null | undefined;
  onPress: () => void;
}

function getMakingFriendIntentionString(rawData: any): string {
  try {
    const parsedData =
      typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    return Array.isArray(parsedData) ? parsedData.join(', ') : '';
  } catch (error) {
    console.error('Error processing making_friend_intention:', error);
    return '';
  }
}

const EditProfile: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<EditProfileScreenNavigationProps>();
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const [person_height, setPerson_height] = useState(my_data.person_height);
  const [person_weight, setPerson_weight] = useState(my_data.person_weight);
  const [person_weight_unit, setPerson_weight_unit] = useState('CM');
  const [person_height_unit, setPerson_height_unit] = useState('KG');
  const [show_person_height_modal, setShow_person_height_modal] =
    useState(false);
  const [show_person_weight_modal, setShow_person_weight_modal] =
    useState(false);
  const [show_dob_modal, setShow_dob_modal] = useState(false);
  const [pic_modal, setPic_modal] = useState(false);
  const [video_modal, setVideo_modal] = useState(false);
  const [picture, setPicture] = useState('');

  // new variable and data
  const [edit_nickname, setEditNickname] = useState<boolean>(false);
  const [edit_username, setEditUsername] = useState<boolean>(false);
  const [edit_gender, setEditGender] = useState<boolean>(false);
  const [edit_dob, setEditDob] = useState<boolean>(false);
  const [edit_emotion_state, setEditEmotionState] = useState<boolean>(false);
  const [edit_description, setEditDescription] = useState<boolean>(false);
  const [edit_instagram, setEditInstagram] = useState<boolean>(false);
  const [edit_facebook, setEditFacebook] = useState<boolean>(false);
  const [edit_twitter, setEditTwitter] = useState<boolean>(false);
  const [edit_youtube, setEditYoutube] = useState<boolean>(false);
  const nickname_data = useRef<string>(my_data?.nickname ?? '');
  const username_data = useRef<string>(my_data?.username ?? '');
  const dob_data = useRef<Date>(
    my_data?.dob ? new Date(my_data.dob) : new Date(),
  );
  const description_data = useRef<string>(my_data?.bio ?? '');
  const instagram_data = useRef<string>(my_data?.instagram ?? '');
  const facebook_data = useRef<string>(my_data?.facebook ?? '');
  const youtube_data = useRef<string>(my_data?.you_tube ?? '');
  const twitter_data = useRef<string>(my_data?.twitter ?? '');

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      // setPicture(result.assets[0].uri);
      setPic_modal(false);
      const formData = new FormData();
      formData.append('images', {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').reverse()[0],
        type: 'image/jpeg',
      });
      try {
        const result = await userApi.changeProfilePicture(
          formData,
          my_data?.auth_token,
        );
        // console.log(result)
      } catch (error) {
        // console.log(error)
      }
    }
  };

  const clickImage = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      setPicture(result.assets[0].uri);
      setPic_modal(false);
      const formData = new FormData();
      formData.append('images', {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').reverse()[0],
        type: 'image/jpeg',
      });
      try {
        const result = await userApi.changeProfilePicture(
          formData,
          my_data?.auth_token,
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'video',
      quality: 1,
      durationLimit: 10,
    });
    if (!result.didCancel) {
      setPicture(result.assets[0].uri);
      setPic_modal(false);
      setVideo_modal(false);
      const formData = new FormData();
      formData.append('videos', {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').reverse()[0],
        type: 'video/mp4',
      });
      try {
        const result = await userApi.changeProfileVideo(
          formData,
          my_data?.auth_token,
        );
        // console.log(result)
      } catch (error) {
        // console.log(error)
      }
    }
  };

  const clickVideo = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      setPicture(result.assets[0].uri);
      setPic_modal(false);
      setVideo_modal(false);
      const formData = new FormData();
      formData.append('videos', {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').reverse()[0],
        type: 'video/mp4',
      });
      try {
        const result = await userApi.changeProfileVideo(
          formData,
          my_data?.auth_token,
        );
        // console.log(result)
      } catch (error) {
        // console.log(error)
      }
    }
  };

  const [list, setList] = useState<ListItem[]>([]);

  useEffect(() => {
    setList([
      {
        name: t('Nickname'),
        value: my_data?.nickname,
        onPress: () => {
          setEditNickname(true);
        },
      },
      {
        name: t('Username'),
        value: my_data?.username,
        onPress: () => {
          setEditUsername(true);
        },
      },
      {
        name: t('Gender'),
        value: my_data?.gender,
        onPress: () => {
          setEditGender(true);
        },
      },
      {
        name: t('Birthday'),
        value: formatDateOnly(my_data?.dob ?? ''),
        onPress: () => {
          setShow_dob_modal(true);
        },
      },
      {
        name: t('Self introduction'),
        value: my_data?.bio,
        onPress: () => {
          setEditDescription(true);
        },
      },
      {
        name: t('Country'),
        value: getMakingFriendIntentionString(my_data?.country),
        onPress: () => {
          navigation.navigate('ProfileCountry');
        },
      },
      {
        name: t('Cities'),
        value: getMakingFriendIntentionString(my_data?.city),
        onPress: () => {
          navigation.navigate('ProfileCity');
        },
      },
      {
        name: t('Emotion State'),
        value: my_data?.emotion_state,
        onPress: () => {
          setEditEmotionState(true);
        },
      },
      {
        name: t('Making friend intention'),
        value: getMakingFriendIntentionString(my_data.making_friend_intention),
        onPress: () => {
          navigation.navigate('Making_friend_intention');
        },
      },
      {
        name: t('Occupation'),
        value: my_data?.occupation,
        onPress: () => {
          navigation.navigate('Industries');
        },
      },
      {
        name: t('Mastery of language'),
        value: getMakingFriendIntentionString(my_data.language),
        onPress: () => {
          navigation.navigate('MasteryOfLanguage');
        },
      },
      {
        name: t('Hobbies'),
        value: getMakingFriendIntentionString(my_data.hobbies),
        onPress: () => {
          navigation.navigate('Hobbies');
        },
      },
      {
        name: t('Height'),
        value: my_data?.person_height,
        onPress: () => {
          setShow_person_height_modal(true);
        },
      },
      {
        name: t('Weight'),
        value: my_data?.person_weight,
        onPress: () => {
          setShow_person_weight_modal(true);
        },
      },
      {
        name: t('Instagram'),
        value: my_data?.instagram,
        onPress: () => {
          setEditInstagram(true);
        },
      },
      {
        name: t('Youtube'),
        value: my_data?.you_tube,
        onPress: () => {
          setEditYoutube(true);
        },
      },
      {
        name: t('Facebook'),
        value: my_data?.facebook,
        onPress: () => {
          setEditFacebook(true);
        },
      },
      {
        name: t('Twitter'),
        value: my_data?.twitter,
        onPress: () => {
          setEditTwitter(true);
        },
      },
    ]);
  }, [my_data]);

  // Nickname handler Section
  const handleNicknameCancel = () => {
    setEditNickname(false);
  };

  const handleNicknameChange = (value: string) => {
    nickname_data.current = value;
  };

  const handleNicknameUpdate = async () => {
    try {
      const data = {
        name: 'nickname',
        value: nickname_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_nickname(nickname_data.current));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error in updating the nickname', error);
    } finally {
      handleNicknameCancel();
    }
  };

  // Username handler section
  const handleUsernameCancel = () => {
    setEditUsername(false);
  };

  const handleUsernameChange = (value: string) => {
    username_data.current = value;
  };

  const handleUserNamePress = async () => {
    try {
      const data = {
        name: 'username',
        value: username_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_username(username_data.current));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error in updating the nickname', error);
    } finally {
      handleUsernameCancel();
    }
  };

  // Gender Section handler
  const handleGenderCancel = () => {
    setEditGender(false);
  };

  const handleGenderPress = async (value: string) => {
    try {
      const data = {
        name: 'gender',
        value: value,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_gender(value));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error generated while updating gender', error);
    } finally {
      handleGenderCancel();
    }
  };

  // Self-Introduction handler section
  const handleSelfIntroductionCancel = () => {
    setEditDescription(false);
  };

  const handleSelfIntroductionChange = (value: string) => {
    description_data.current = value;
  };
  const handleSelfIntroductionPress = async () => {
    try {
      const data = {
        name: 'bio',
        value: description_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_bio(description_data.current));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error in updating the bio', error);
    } finally {
      handleSelfIntroductionCancel();
    }
  };

  // Emotion-State Section handler
  const handleEmotionStateCancel = () => {
    setEditEmotionState(false);
  };
  const handleEmotionStatePress = async (value: string) => {
    try {
      const data = {
        name: 'emotion_state',
        value: value,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_emotion_state(value));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error generated while updating the emotion state', error);
    } finally {
      handleEmotionStateCancel();
    }
  };

  const handleHeightPress = (value: string) => {
    const name = 'person_height';
    const data = {
      name,
      value,
    };
    updateProfile(my_data?.auth_token, data)
      .then(res => {
        Toast.show(res.message, Toast.SHORT);
        dispatch(update_person_height(value));
      })
      .catch(err => {
        console.log(err.message);
      });
    setShow_person_height_modal(false);
  };

  const handleWeightPress = (value: string) => {
    const name = 'person_weight';
    const data = {
      name,
      value,
    };
    updateProfile(my_data?.auth_token, data)
      .then(res => {
        Toast.show(res.message, Toast.SHORT);
        dispatch(update_person_weight(value));
      })
      .catch(err => {
        console.log(err.message);
      });
    setShow_person_weight_modal(false);
  };

  // Instagram handler section
  const handleInstagramCancel = () => {
    setEditInstagram(false);
  };

  const handleInstagramChange = (value: string) => {
    instagram_data.current = value;
  };
  const handleInstagramPress = async () => {
    try {
      const data = {
        name: 'bio',
        value: instagram_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_instagram(instagram_data.current));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error in updating the instagram', error);
    } finally {
      handleInstagramCancel();
    }
  };

  // Facebook handler section
  const handleFacebookCancel = () => {
    setEditFacebook(false);
  };

  const handleFacebookChange = (value: string) => {
    facebook_data.current = value;
  };
  const handleFacebookPress = async () => {
    try {
      const data = {
        name: 'bio',
        value: facebook_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      dispatch(update_facebook(facebook_data.current));
      Toast.show(res.message, Toast.SHORT);
    } catch (error) {
      console.log('Error in updating the facebook', error);
    } finally {
      handleFacebookCancel();
    }
  };

  // youtube section handler
  const handleYoutubeCancel = () => {
    setEditYoutube(false);
  };

  const handleYoutubeChange = (value: string) => {
    youtube_data.current = value;
  };

  const handleYoutubePress = async () => {
    try {
      const data = {
        name: 'you_tube',
        value: youtube_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      Toast.show(res.message, Toast.SHORT);
      dispatch(update_you_tube(youtube_data.current));
    } catch (error) {
      console.log('Error in updating the you tube data', error);
    } finally {
      handleYoutubeCancel();
    }
  };

  // Twitter section handler
  const handleTwitterCancel = () => {
    setEditTwitter(false);
  };
  const handleTwitterChange = (value: string) => {
    twitter_data.current = value;
  };

  const handleTwitterPress = async () => {
    try {
      const data = {
        name: 'twitter',
        value: twitter_data.current,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      Toast.show(res.message, Toast.SHORT);
      dispatch(update_twitter(twitter_data.current));
    } catch (error) {
      console.log('Error generating in updating users twitter account', error);
    } finally {
      handleTwitterCancel();
    }
  };

  // Date of birth section handler
  const handleDobCancel = () => {
    setEditDob(false);
  };
  const handleDobPress = async (value: any) => {
    try {
      const data = {
        name: 'dob',
        value: value,
      };
      const res = await updateProfile(my_data?.auth_token, data);
      Toast.show(res.message, Toast.SHORT);
      dispatch(update_dob(value));
    } catch (error) {
      console.log('Error generated while updating dob', error);
    } finally {
      handleDobCancel();
    }
  };

  // Countries

  const RenderHeaderItem = () => {
    return (
      <TouchableOpacity
        style={styles.picView}
        onPress={() => {
          setPic_modal(true);
        }}>
        <Image
          source={
            my_data?.profile_pic
              ? {uri: my_data?.profile_pic}
              : icons.userFilled
          }
          style={styles.header_profile_pic}
        />
        <Text style={[styles.headerText, {fontSize: 16, marginLeft: 0}]}>
          {t('Change Photo')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Body style={{flex: 1}}>
      <Header headertext={t('Edit Profile')} />

      {/* Edit Profile Body section */}
      <Body applyPadding={false} style={styles.bodyContainer}>
        <FlatList
          data={list}
          ListHeaderComponent={RenderHeaderItem}
          renderItem={({item}) => (
            <Pressable onPress={item?.onPress}>
              <Body applyPadding={false} style={styles.secondContainer}>
                <Text style={styles.txt}>{item.name}</Text>
                <Body applyPadding={false} style={styles.leftContainer}>
                  <Text style={[styles.txt, {color: 'rgba(0, 0, 0, 0.4)'}]}>
                    {item?.value?.slice(0, 25)}
                  </Text>
                  <TouchableOpacity
                    style={{marginLeft: 5}}
                    onPress={item.onPress}>
                    <AntDesign name="right" size={20} color={'grey'} />
                  </TouchableOpacity>
                </Body>
              </Body>
            </Pressable>
          )}
        />
      </Body>

      {/* height modal  */}
      <Modal visible={show_person_height_modal} transparent={true}>
        <Pressable
          style={styles.modal_background}
          onPress={() => {
            setShow_person_height_modal(false);
          }}
        />
        <Body applyPadding={false} style={styles.nickname_modal}>
          <Text style={styles.modal_text}>{t('Height')}</Text>
          <Body applyPadding={false} style={styles.height_middle_modal}>
            <TextInput
              placeholder={t('Please fill it')}
              style={{width: width * 0.22}}
              keyboardType="numeric"
              value={person_height}
              onChangeText={val => {
                setPerson_height(val);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setPerson_height_unit('CM');
              }}>
              <Text
                style={{
                  color: person_height_unit == 'CM' ? '#FC1B87' : 'black',
                }}>
                {t('CM')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPerson_height_unit('FT');
              }}>
              <Text
                style={{
                  color: person_height_unit == 'FT' ? '#FC1B87' : 'black',
                }}>
                {t('FT')}
              </Text>
            </TouchableOpacity>
          </Body>

          <View style={styles.modal_button_view}>
            <TouchableOpacity
              style={styles.modal_button}
              onPress={() => {
                setShow_person_height_modal(false);
              }}>
              <Text style={styles.modal_button_text}>{t('Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleHeightPress(person_height + ' ' + person_height_unit);
              }}
              style={styles.modal_button}>
              <Text style={styles.modal_button_text}>{t('Save')}</Text>
            </TouchableOpacity>
          </View>
        </Body>
      </Modal>

      {/* weight modal */}
      <Modal visible={show_person_weight_modal} transparent={true}>
        <Pressable
          style={styles.modal_background}
          onPress={() => {
            setShow_person_weight_modal(false);
          }}
        />
        <Body applyPadding={false} style={styles.nickname_modal}>
          <Text style={styles.modal_text}>{t('Weight')}</Text>
          <Body applyPadding={false} style={styles.height_middle_modal}>
            <TextInput
              placeholder={t('Please fill it')}
              style={{width: width * 0.22}}
              keyboardType="numeric"
              value={person_weight}
              onChangeText={(val: any) => {
                setPerson_weight(val);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setPerson_weight_unit('Kg');
              }}>
              <Text
                style={{
                  color: person_weight_unit == 'Kg' ? '#FC1B87' : 'black',
                }}>
                {t('Kg')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPerson_weight_unit('Lb');
              }}>
              <Text
                style={{
                  color: person_weight_unit == 'Lb' ? '#FC1B87' : 'black',
                }}>
                {t('Lb')}
              </Text>
            </TouchableOpacity>
          </Body>
          <View style={styles.modal_button_view}>
            <TouchableOpacity
              style={styles.modal_button}
              onPress={() => {
                setShow_person_weight_modal(false);
              }}>
              <Text style={styles.modal_button_text}>{t('Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleWeightPress(person_weight + ' ' + person_weight_unit);
              }}
              style={styles.modal_button}>
              <Text style={styles.modal_button_text}>{t('Save')}</Text>
            </TouchableOpacity>
          </View>
        </Body>
      </Modal>

      {/* modal for picking date of birth */}
      <DatePicker
        modal
        open={show_dob_modal}
        date={dob_data.current}
        mode="date"
        onConfirm={date => {
          handleDobPress(date);
        }}
        onCancel={() => {
          setShow_dob_modal(false);
        }}
      />

      {/* modal for profile picture */}

      <Modal
        visible={pic_modal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="slide">
        <Pressable
          onPress={() => {
            setPic_modal(false);
          }}
          style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
        />
        <View style={styles.modal_main_view}>
          <TouchableOpacity onPress={pickImages} style={styles.modal_button1}>
            <MaterialIcons name="photo-library" color={'black'} size={35} />
            <Text
              style={{
                color: 'black',
              }}>
              {t('Photo Gallery')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Avatar');
            }}
            style={styles.modal_button1}>
            <Image
              source={images.avatar}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            />
            <Text
              style={{
                color: 'black',
              }}>
              {t('Avatar list')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={clickImage} style={styles.modal_button1}>
            <Entypo name="camera" color={'black'} size={35} />
            <Text
              style={{
                color: 'black',
              }}>
              {t('Camera')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* profile video section */}
      <Modal visible={video_modal} transparent={true} animationType="slide">
        <Pressable
          onPress={() => {
            setVideo_modal(false);
          }}
          style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
        />
        <View style={styles.modal_main_view}>
          <TouchableOpacity onPress={pickVideo} style={styles.modal_button1}>
            <MaterialIcons name="photo-library" color={'black'} size={35} />
            <Text
              style={{
                color: 'black',
              }}>
              {t('Video Gallery')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={clickVideo} style={styles.modal_button1}>
            <Entypo name="camera" color={'black'} size={35} />
            <Text
              style={{
                color: 'black',
              }}>
              {t('Camera')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Nickname section */}
      <ChangedInputBox
        headerName="NICKNAME"
        handleCancelButton={handleNicknameCancel}
        handleSaveButton={handleNicknameUpdate}
        onValueChange={handleNicknameChange}
        inputType={'nickname'}
        initialValue={my_data?.nickname ?? ''}
        visible={edit_nickname}
      />

      {/* Username Section  */}
      <ChangedInputBox
        headerName="USERNAME"
        handleCancelButton={handleUsernameCancel}
        handleSaveButton={handleUserNamePress}
        onValueChange={handleUsernameChange}
        inputType={'username'}
        initialValue={my_data?.username ?? ''}
        visible={edit_username}
      />

      {/* Description Section  */}
      <ChangedInputBox
        headerName="SELF-DESCRIPTION"
        handleCancelButton={handleSelfIntroductionCancel}
        handleSaveButton={handleSelfIntroductionPress}
        onValueChange={handleSelfIntroductionChange}
        inputType={'self description'}
        initialValue={my_data?.bio ?? ''}
        visible={edit_description}
        multiline={true}
      />

      {/* Date of birth Section  */}
      <DatePicker
        modal={true}
        open={edit_dob}
        date={dob_data.current}
        mode="date"
        onConfirm={handleDobPress}
        onCancel={handleDobCancel}
      />

      {/* Instagram Section  */}
      <ChangedInputBox
        headerName="INSTAGRAM"
        handleCancelButton={handleInstagramCancel}
        handleSaveButton={handleInstagramPress}
        onValueChange={handleInstagramChange}
        inputType={'instagram'}
        initialValue={my_data?.instagram ?? ''}
        visible={edit_instagram}
      />

      {/* You tube Section  */}
      <ChangedInputBox
        headerName="YOUTUBE"
        handleCancelButton={handleYoutubeCancel}
        handleSaveButton={handleYoutubePress}
        onValueChange={handleYoutubeChange}
        inputType={'youtube'}
        initialValue={my_data?.you_tube ?? ''}
        visible={edit_youtube}
      />

      {/* Facebook Section  */}
      <ChangedInputBox
        headerName="FACEBOOK"
        handleCancelButton={handleFacebookCancel}
        handleSaveButton={handleFacebookPress}
        onValueChange={handleFacebookChange}
        inputType={'facebook'}
        initialValue={my_data?.facebook ?? ''}
        visible={edit_facebook}
      />

      {/* Twitter Section  */}
      <ChangedInputBox
        headerName="X(formally TWITTER)"
        handleCancelButton={handleTwitterCancel}
        handleSaveButton={handleTwitterPress}
        onValueChange={handleTwitterChange}
        inputType={'X'}
        initialValue={my_data?.twitter ?? ''}
        visible={edit_twitter}
      />

      {/* Gender Section  */}
      <OptionSelector
        headerName={'GENDER'}
        handleCancelButton={handleGenderCancel}
        handleSave={handleGenderPress}
        value={['Male', 'Female', 'Other']}
        initialValue={my_data?.gender ?? ''}
        visible={edit_gender}
      />

      {/* Emotion-State Section  */}
      <OptionSelector
        headerName={'EMOTION-STATE'}
        handleCancelButton={handleEmotionStateCancel}
        handleSave={handleEmotionStatePress}
        value={['Single', 'In Love', 'Married', 'Seperated']}
        initialValue={my_data?.emotion_state ?? ''}
        visible={edit_emotion_state}
      />
    </Body>
  );
};

export default React.memo(EditProfile);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 25,
    marginTop: 3,
  },
  picView: {
    alignItems: 'center',
  },
  firstContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-evenly',
  },
  bodyContainer: {
    flex: 1,
  },
  secondContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: width * 0.05,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  nickname_modal: {
    width: width * 0.7,
    height: height * 0.32,
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    paddingTop: 5,
    borderRadius: 10,
  },
  modal_text: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  modal_button_text: {
    color: 'white',
  },
  modal_gender: {
    flexDirection: 'row',
    width: width * 0.4,
    justifyContent: 'space-between',
    marginTop: height * 0.04,
  },
  emotion_card: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: width * 0.17,
    marginHorizontal: width * 0.015,
  },
  emotion_container: {
    flexDirection: 'row',
    width: width * 0.6,
    marginTop: height * 0.05,
  },
  height_middle_modal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: width * 0.5,
    marginTop: height * 0.02,
  },
  modal_main_view: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: width * 1,
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    zIndex: 1000,
  },
  modal_button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 2,
  },
  modal_button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRightWidth: 0.5,
    borderColor: 'black',
    borderLeftWidth: 0.5,
  },
  modal_background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modal_button_view: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 10,
  },
  header_profile_pic: {
    width: 55,
    height: 55,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 28,
  },
});
