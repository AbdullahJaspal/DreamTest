import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';
import SettingStackNavigation from './SettingStackNavigation';
import HashtagScreen from '../screens/hashtag/HashtagScreen';
import SoundMainScreen from '../screens/sounds/SoundMainScreen';
import UseSoundScreen from '../screens/sounds/UseSoundScreen';
import UserProfileMainPage from '../screens/other_user/UserProfileMainPage';
import WatchProfileVideo from '../screens/other_user/WatchProfileVideo';
import ProfileBigPicScreen from '../screens/profile/ProfileBigPicScreen';
import ProfileReportScreen from '../screens/other_user/ProfileReportScreen';
import Followings from '../screens/profile/profile/screen/Followings';
import Followers from '../screens/profile/profile/screen/Followers';
import LikesHistory from '../screens/profile/profile/screen/LikesHistory';
import FeedStackNavigation from './FeedStackNavigation';
import ProfileReportListSelectionScreen from '../screens/other_user/ProfileReportListSelectionScreen';
import ShareReportScreen from '../screens/home/components/ShareReportScreen';
import ShareOtherReport from '../screens/home/components/ShareOtherReport';
import Index from '../screens/index';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PictureFeedScreen from '../screens/picture_feed/screens/PictureFeedScreen';
import EditPostPictureScreen from '../screens/newVideo/EditPostPictureScreen';
import ChatScreen from '../screens/InboxStack/chat';

const RootStack = createNativeStackNavigator();
const RootStackNavigation: React.FC = () => {
  return (
    <>
      <RootStack.Navigator
        initialRouteName="BottomTabNavigation"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
        />
        <RootStack.Screen
          name="SettingStackNavigation"
          component={SettingStackNavigation}
        />
        <RootStack.Screen name="HashtagScreen" component={HashtagScreen} />
        <RootStack.Screen name="SoundMainScreen" component={SoundMainScreen} />
        <RootStack.Screen name="UseSoundScreen" component={UseSoundScreen} />
        <RootStack.Screen
          name="UserProfileMainPage"
          component={UserProfileMainPage}
        />
        <RootStack.Screen
          name="WatchProfileVideo"
          component={WatchProfileVideo}
        />
        <RootStack.Screen
          name="ProfileBigPicScreen"
          component={ProfileBigPicScreen}
        />
        <RootStack.Screen
          name="ProfileReportScreen"
          component={ProfileReportScreen}
        />
        <RootStack.Screen name="Followings" component={Followings} />
        <RootStack.Screen name="Followers" component={Followers} />
        <RootStack.Screen name="LikesHistory" component={LikesHistory} />
        <RootStack.Screen
          name="FeedStackNavigation"
          component={FeedStackNavigation}
        />
        <RootStack.Screen
          name="ProfileReportListSelectionScreen"
          component={ProfileReportListSelectionScreen}
        />
        <RootStack.Screen
          name="ShareReportScreen"
          component={ShareReportScreen}
        />
        <RootStack.Screen
          name="ShareOtherReport"
          component={ShareOtherReport}
        />

        <RootStack.Screen
          name="EditPostPictureScreen"
          component={EditPostPictureScreen}
        />

        <RootStack.Screen name="Me" component={ProfileScreen} />

        <RootStack.Screen name="Index" component={PictureFeedScreen} />
        <RootStack.Screen name="ChatScreen" component={ChatScreen} />
      </RootStack.Navigator>
      <Index />
    </>
  );
};

export default React.memo(RootStackNavigation);
