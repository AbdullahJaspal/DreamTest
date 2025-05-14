import React, {useCallback} from 'react';
import FollowTab from './FollowTab';
import MyTabBar from './tab/MyTabBar';
import {Container} from '../../components';
import {COLOR} from '../../configs/styles';
import {useTranslation} from 'react-i18next';
import GiftSheet from './components/GiftSheet';
import ShareSheet from './components/ShareSheet';
import {useAppSelector} from '../../store/hooks';
import TopSectionList from './components/TopSectionList';
import {selectShowVideoSectionIcons} from '../../store/selectors';
import BottomSheetComment from '../main/components/BottomSheetComment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const showVideoSectionIcons = useAppSelector(selectShowVideoSectionIcons);
  const {t} = useTranslation();

  const pauseVideo = useCallback(() => {
    console.log('Hey, guys will be clicking here');
  }, []);

  const playVideo = useCallback(() => {
    console.log('hey, i am wrting to express here something');
  }, []);

  const followingOptions = {title: t('Following')};
  const forYouOptions = {title: t('For you')};

  return (
    <Container flex={1} backgroundColor={COLOR.BLACK}>
      {showVideoSectionIcons && (
        <TopSectionList
          pauseVideo={pauseVideo}
          playVideo={playVideo}
          user={undefined}
        />
      )}

      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        initialRouteName="ForYou">
        <Tab.Screen
          name="Following"
          component={FollowTab}
          options={followingOptions}
        />
        <Tab.Screen
          name="ForYou"
          component={FollowTab}
          options={forYouOptions}
        />
      </Tab.Navigator>
      <BottomSheetComment />
      <ShareSheet />
      <GiftSheet />
    </Container>
  );
};

export default React.memo(HomeScreen);
