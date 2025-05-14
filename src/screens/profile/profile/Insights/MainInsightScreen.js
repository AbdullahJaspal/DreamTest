import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import LiveAnalytics from './LiveAnalytics';
import GeneralAnalytics from './GeneralAnalytics';
import VideoAnalytics from './VideoAnalytics';
// import GeamsAnalytics from './GeamsAnalytics';
import MeAnalytics from './MeAnalytics';
import ContentAnalytics from './ContentAnalytics';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import CustomTab from './component/CustomTab';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const MainInsightScreen = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [active_name, setActive_name] = useState(t('Analytics'));

  const data = [
    {
      name: 'Account reached',
      value: 3,
      percentage: '80%',
      onPress: null,
    },
    {
      name: 'Account engaged',
      value: 1,
      percentage: '-40%',
      onPress: null,
    },
    {
      name: 'Total Followers',
      value: 0,
      percentage: '10%',
      onPress: null,
    },
    {
      name: 'Total spended time',
      value: 5,
      percentage: '100%',
      onPress: () => {
        navigation.navigate('TotalSpendedTime');
      },
    },
    {
      name: 'Total like',
      value: 3,
      percentage: '100%',
      onPress: null,
    },
    {
      name: 'Total diamond',
      value: 3,
      percentage: '100%',
      onPress: () => {
        navigation.navigate('DiamondAnalytics');
      },
    },
    {
      name: 'Total comment',
      value: 3,
      percentage: '100%',
      onPress: null,
    },
  ];

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
              marginLeft: 100,
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

              <CustomTab
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
        {/* <Tab.Screen
          name="Live Analytics"
          component={LiveAnalytics}
          options={{title: 'Live'}}
        /> */}
        <Tab.Screen
          name="General Analytics"
          component={GeneralAnalytics}
          options={{title: t('General')}}
        />
        <Tab.Screen
          name="Video Analytics"
          component={VideoAnalytics}
          options={{title: t('Video')}}
        />
        {/* <Tab.Screen
          name="Game Analytics"
          component={GeamsAnalytics}
          options={{ title: 'Games' }}
        /> */}
        <Tab.Screen
          name="Me Analytics"
          component={MeAnalytics}
          options={{title: t('Me')}}
        />
        <Tab.Screen
          name="Content Analytics"
          component={ContentAnalytics}
          options={{title: t('Content')}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainInsightScreen;

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
});
