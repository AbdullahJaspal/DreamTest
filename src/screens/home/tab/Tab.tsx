import {StyleSheet, Text, View, Animated} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR, SPACING, TEXT} from '../../../configs/styles';
import RedDot from '../../../components/more/RedDot';
import {Container} from '../../../components';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  NavigationHelpers,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {MaterialTopTabNavigationEventMap} from '@react-navigation/material-top-tabs';

interface TabProps {
  state: {
    index: number;
    routes: {key: string; name: string; params?: any}[];
  };
  route: RouteProp<ParamListBase, string>;
  descriptors: any;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
  index: number;
  position: Animated.Value;
}

const Tab = React.forwardRef<View, TabProps>(
  ({state, route, descriptors, navigation, index, position}, ref) => {
    const {options} = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const onPress = () => {
      if (!isFocused) {
        navigation.navigate(route.name, {merge: true});
      }
    };

    const onLongPress = () => {
      // Handle long press (optional, if needed)
      navigation.setParams({tabLongPress: true});
    };

    const inputRange = state.routes.map((_, i) => i);
    const outputRange = inputRange.map(i => (i === index ? 1 : 0.5));

    const opacity = position.interpolate({
      inputRange,
      outputRange,
    });

    return (
      <View ref={ref} style={styles.container}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}>
          <Animated.View style={{opacity}}>
            <Text style={styles.label}>{label}</Text>
          </Animated.View>
        </TouchableOpacity>
        {index === 0 && (
          <Container position="absolute" right={0} top={SPACING.S3}>
            <RedDot />
          </Container>
        )}
      </View>
    );
  },
);

export default Tab;

const styles = StyleSheet.create({
  container: {
    padding: SPACING.S3,
  },
  label: {
    textTransform: 'capitalize',
    ...TEXT.STRONG,
    fontSize: 15,
    color: COLOR.WHITE,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
