import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import My_Tab from './components/My_Tab';
import Download_data from './Download_data';
import Request_data from './Request_data';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const MainScreen = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [active_name, setActive_name] = useState(t('Download Information'));

  const CustomHeader = () => {
    return (
      <View style={{flexDirection: 'row', height: 50, backgroundColor: '#fff'}}>
        <Pressable
          style={{top: 10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign
            name="arrowleft"
            size={25}
            color={'black'}
            marginLeft={15}
          />
        </Pressable>
        <View>
          <Text
            style={{
              marginLeft: 60,
              fontSize: 20,
              fontWeight: 600,
              color: '#000',
              top: 10,
            }}>
            {active_name}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        tabBar={props => {
          return (
            <React.Fragment>
              <CustomHeader {...props} />
              <My_Tab
                {...props}
                activeTabIndex={activeTabIndex}
                onTabPress={index => setActiveTabIndex(index)}
              />
            </React.Fragment>
          );
        }}
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen
          name="Download_data"
          component={Request_data}
          options={{title: t('Download Data')}}
        />
        <Tab.Screen
          name="Request_data"
          component={Download_data}
          options={{title: t('Download Data')}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
});
