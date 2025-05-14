import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as videoApi from '../../apis/video.api';
import {useDispatch} from 'react-redux';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  GestureResponderEvent,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createThumbnail} from 'react-native-create-thumbnail';
import {useSharedValue} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';

import {CText} from '../../components';
import FullScreenLoader from '../../components/FullScreenLoader';
import Header from '../profile/profile/components/Header';
import TopPostVideo from './components/TopPostVideo';
import ItemChoose from './components/ItemChoose';
import ChooseCategories from './ChooseCategories';
import TaggingUser from './components/TaggingUser';
import ConfirmModal from '../../components/ConfirmModal';

import {BORDER, COLOR} from '../../configs/styles';
import {
  setShowUploadingInfo,
  addPostProgressData,
} from '../../store/slices/content/postSlice';
import {removehashtag} from '../../store/slices/content/postHashtagSlice';
import {
  PostVideoScreenNavigationProps,
  PostVideoScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {TaggedDataProps} from './types/Audio';
import {extractHashtags} from './utils/extractHashtags';
import {icons} from '../../assets/icons';
import {useAppSelector} from '../../store/hooks';
import {
  selectHashtagTitle,
  selectMyProfileData,
  selectVideo,
} from '../../store/selectors';

const PostVideoScreen: React.FC = () => {
  const navigation = useNavigation<PostVideoScreenNavigationProps>();
  const {t, i18n} = useTranslation();
  const route = useRoute<PostVideoScreenRouteProps>();
  const dispatch = useDispatch();

  const [showTagModel, setShowTagModel] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<boolean>(
    route?.params?.privacy_type ?? false,
  );
  const [allow_comment, setAllow_comment] = useState<boolean>(
    route?.params?.allow_comments ?? true,
  );
  const [allow_duet, setAllowDuet] = useState<boolean>(
    route?.params?.allow_duet ?? false,
  );
  const [image, setImage] = useState<string>('');
  const [allow_stitch, setAllow_stitch] = useState<boolean>(
    route?.params?.allow_stitch ?? false,
  );
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    hashtag ? `#${hashtag}` : '',
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    confirmAction: () => {},
  });

  const countries = useRef<number[]>([]);
  const cities = useRef<number[]>([]);
  const postTopic = useRef<string>(route?.params?.video_topic ?? '');
  const title = useRef<string>('');
  const taggedUsers = useRef<TaggedDataProps[]>([]);

  const video = useAppSelector(selectVideo);
  const my_data = useAppSelector(selectMyProfileData);
  const hashtag = useAppSelector(selectHashtagTitle);

  const loading = useSharedValue<boolean>(false);

  const generate_thumbnail = useCallback(async () => {
    if (!route.params.profile_pic) {
      try {
        const result = await createThumbnail({
          url: `file://${video?.video_url}`,
          timeStamp: 1000,
          format: 'png',
        });
        setImage(result.path);
      } catch (error) {
        console.error('Error generated while building thumbnail', error);
      }
    }
  }, [route.params.profile_pic, video?.video_url]);

  useEffect(() => {
    generate_thumbnail();
  }, [useCallback]);

  const showAlertModal = (
    title: string,
    message: string,
    confirmAction: () => void,
  ) => {
    setConfirmModalConfig({
      title,
      message,
      confirmText: t('OK'),
      confirmAction,
    });
    setShowConfirmModal(true);
  };

  const handlePostVideo = async () => {
    if (my_data) {
      try {
        if (title?.current?.length && description?.length) {
          loading.value = true;
          const formData = new FormData();
          formData.append('video', {
            uri: `${video?.video_url}`,
            name: video?.video_url.split('/').reverse()[0],
            type: 'video/mp4',
          });

          formData.append('cover', {
            uri: image,
            name: image?.split('/').reverse()[0],
            type: 'image/jpeg',
          });

          if (route?.params?.remix_video_id) {
            formData.append('remix_video_id', route?.params?.remix_video_id);
          }
          formData.append('caption', description);
          formData.append('privacy', privacy);
          formData.append('allow_comment', allow_comment);
          formData.append('allow_duet', allow_duet);
          formData.append('allow_stitch', allow_stitch);
          formData.append('countries', countries.current);
          formData.append('cities', cities.current);
          formData.append('hashtag', extractHashtags(description));
          formData.append(
            'tag_people',
            taggedUsers.current.map(item => item.username),
          );
          formData.append(
            'tagged_people_id',
            taggedUsers.current.map(item => item.user_id),
          );
          formData.append('title', title.current);
          formData.append('video_topic', postTopic.current);
          formData.append('video_durations', route.params?.durations);

          dispatch(setShowUploadingInfo(true));
          videoApi.postVideo(
            formData,
            my_data?.auth_token,
            (progress: number) => {
              console.log('progress', progress);
              if (progress == 100) {
                dispatch(setShowUploadingInfo(false));
              }
              dispatch(addPostProgressData(progress));
            },
          );
          dispatch(removehashtag());
          navigation.navigate('Me');
        } else {
          showAlertModal(
            t('Missing Details'),
            t('Please write a title and description to post your video.'),
            () => {},
          );
        }
      } catch (error) {
        console.log('Error generated while posting video: ', error);
      } finally {
        loading.value = false;
      }
    }
  };

  const handleCategories = () => {
    setShowCategories(true);
  };

  const handleDraftVideoPress = async () => {
    if (my_data) {
      try {
        const formData = new FormData();
        formData.append('video', {
          uri: `${video?.video_url}`,
          name: video?.video_url.split('/').reverse()[0],
          type: 'video/mp4',
        });

        formData.append('cover', {
          uri: image,
          name: image?.split('/').reverse()[0],
          type: 'image/jpeg',
        });

        if (route?.params?.remix_video_id) {
          formData.append('remix_video_id', route?.params?.remix_video_id);
        }
        formData.append('caption', description);
        formData.append('privacy', privacy);
        formData.append('allow_comment', allow_comment);
        formData.append('allow_duet', allow_duet);
        formData.append('allow_stitch', allow_stitch);
        formData.append('countries', countries);
        formData.append('cities', cities);
        formData.append('hashtag', hashtag);
        formData.append(
          'tag_people',
          taggedUsers.current.map(item => item.username),
        );
        formData.append(
          'tagged_people_id',
          taggedUsers.current.map(item => item.user_id),
        );
        formData.append('title', title);
        formData.append('video_topic', postTopic.current);
        formData.append('video_durations', route.params?.durations);
        dispatch(setShowUploadingInfo(true));
        videoApi.draftVideos(formData, my_data?.auth_token);
        navigation.navigate('Me');
        dispatch(removehashtag());
      } catch (error) {
        console.log('error during post video: ', error);
      } finally {
      }
    }
  };

  function handleTagFollowers(_event: GestureResponderEvent): void {
    setShowTagModel(true);
  }

  function handleShowTagClose(userIDs: TaggedDataProps[]): void {
    taggedUsers.current = userIDs;

    let currentDescription = description || '';
    const mentionRegex = /@\w+/g;
    const mentionedUsernames = currentDescription.match(mentionRegex) || [];

    const mentionedNames = mentionedUsernames.map(mention => mention.slice(1));
    const taggedUsernames = userIDs.map(user => user.username);

    const unmatchedUsernames = taggedUsernames.filter(
      username => !mentionedNames.includes(username),
    );

    if (unmatchedUsernames.length > 0) {
      const newMentions = unmatchedUsernames
        .map(username => `@${username}`)
        .join(' ');
      currentDescription += ` ${newMentions}`;
    }

    // Ensure the description does not exceed 1000 characters
    if (currentDescription.length > 1000) {
      currentDescription = currentDescription.slice(0, 1000);
    }

    setDescription(currentDescription.trim());
    setShowTagModel(false);
  }

  function handleTitleChange(txt: string): void {
    title.current = txt;
  }

  function handleCoverChange(img: string): void {
    setImage(img);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.main_container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.main_container}>
          <FullScreenLoader sharedLoader={loading} />
          <Header headertext={t('Post Video')} />

          <ScrollView
            nestedScrollEnabled={true}
            style={styles.scrollView}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}>
            <TopPostVideo
              pathVideo={video?.video_url}
              durations={route.params.durations || 1}
              image={image}
              onTitleChange={handleTitleChange}
              onCoverChange={handleCoverChange}
              description={description}
              setDescription={setDescription}
              setShowTagModel={setShowTagModel}
            />
            <ItemChoose
              iconLeft={icons.user}
              name={t('Tag your followers')}
              iconRight={icons.right}
              onPress={handleTagFollowers}
            />

            <ItemChoose
              iconLeft={icons.locationOutline}
              name={t('Location')}
              iconRight={icons.right}
              onPress={() => {
                navigation.navigate('SelectingLocationScreen', {
                  countries: countries,
                  cities: cities,
                });
              }}
            />

            <ItemChoose
              iconLeft={icons.hash}
              name={t('Choose Categories')}
              iconRight={icons.right}
              onPress={handleCategories}
            />

            <ItemChoose
              iconLeft={icons.lockOutline}
              name={t('Who can watch this video')}
              type={privacy ? 'Only you' : 'Public'}
              onChange={a => setPrivacy(a)}
              value={privacy}
            />
            <ItemChoose
              iconLeft={icons.messageRound}
              name={t('Comments are allowed')}
              value={allow_comment}
              initValue={allow_comment}
              onChange={e => setAllow_comment(e)}
            />
            <ItemChoose
              iconLeft={icons.smartRecord}
              name={t('Allow Duet')}
              initValue={allow_duet}
              onChange={e => setAllowDuet(e)}
            />

            <ItemChoose
              iconLeft={icons.switch}
              name={t('Allow Stitch')}
              initValue={allow_stitch}
              onChange={setAllow_stitch}
            />
          </ScrollView>

          <View style={styles.actionBottom}>
            <Pressable
              style={[styles.button, {backgroundColor: COLOR.WHITE}]}
              onPress={handleDraftVideoPress}>
              <CText>{t('Draft')}</CText>
            </Pressable>

            <Pressable
              style={[styles.button, {backgroundColor: COLOR.DANGER2}]}
              onPress={handlePostVideo}>
              <CText color={COLOR.WHITE}>{t('Post')}</CText>
            </Pressable>
          </View>

          <ChooseCategories
            showCategories={showCategories}
            setShowCategories={setShowCategories}
            postTopic={postTopic}
          />

          <TaggingUser
            showTagModel={showTagModel}
            onClose={handleShowTagClose}
          />

          <ConfirmModal
            visible={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={() => {
              confirmModalConfig.confirmAction();
              setShowConfirmModal(false);
            }}
            title={confirmModalConfig.title}
            message={confirmModalConfig.message}
            confirmText={confirmModalConfig.confirmText}
            cancelText={t('Cancel')}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default React.memo(PostVideoScreen);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER.SMALL,
    borderWidth: 1,
    borderColor: COLOR.LIGHT_GRAY,
  },
  actionBottom: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 50,
  },
  main_container: {
    flex: 1,
  },
  scrollView: {
    marginBottom: 60,
  },
});
