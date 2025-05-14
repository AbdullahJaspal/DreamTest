import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UnifiedNotificationScreen from '../screens/InboxStack/notification/UnifiedNotification';
import UserProfileScreen from '../screens/InboxStack/chatProfile/UserProfileScreen';
import MediaGalleryScreen from '../screens/InboxStack/chatProfile/MediaGalleryScreen';
import InboxScreen from '../screens/InboxStack/inbox';
import VideoCall from '../screens/InboxStack/chat/VideoCall';
import AudioCall from '../screens/InboxStack/chat/components/AudioCall';
import ChatScreen from '../screens/InboxStack/chat';
import ContactList from '../screens/InboxStack/contactList/ContactList';

const InboxStack = createNativeStackNavigator();

const InboxStackNavigation: React.FC = () => {
  return (
    <InboxStack.Navigator
      initialRouteName="InboxScreen"
      screenOptions={{headerShown: false}}>
      <InboxStack.Screen name="InboxScreen" component={InboxScreen} />
      <InboxStack.Screen name="VideoCall" component={VideoCall} />
      <InboxStack.Screen name="AudioCall" component={AudioCall} />
      <InboxStack.Screen name="ChatScreen" component={ChatScreen} />
      <InboxStack.Screen name="ContactList" component={ContactList} />

      <InboxStack.Screen
        name="Notifications"
        component={UnifiedNotificationScreen}
        options={{headerShown: false}}
      />
      <InboxStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{headerShown: false}}
      />
      <InboxStack.Screen
        name="MediaGalleryScreen"
        component={MediaGalleryScreen}
        options={{headerShown: false}}
      />
    </InboxStack.Navigator>
  );
};

export default React.memo(InboxStackNavigation);
