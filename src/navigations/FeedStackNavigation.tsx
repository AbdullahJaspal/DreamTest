import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PictureFeedScreen from '../screens/picture_feed/screens/PictureFeedScreen';
import PicturePostDetails from '../screens/picture_feed/screens/PicturePostDetails';
import CommentScreen from '../screens/picture_feed/screens/CommentScreen';

const FeedStack = createNativeStackNavigator();

const FeedStackNavigation: React.FC = () => {
  return (
    <FeedStack.Navigator
      initialRouteName="PictureFeedScreen"
      screenOptions={{ headerShown: false }}>
      <FeedStack.Screen
        name="PictureFeedScreen"
        component={PictureFeedScreen}
        initialParams={{ postId: null }}
      />
      <FeedStack.Screen
        name="PicturePostDetails"
        component={PicturePostDetails}
      />
      <FeedStack.Screen name="CommentScreen" component={CommentScreen} />
    </FeedStack.Navigator>
  );
};

export default React.memo(FeedStackNavigation); 
