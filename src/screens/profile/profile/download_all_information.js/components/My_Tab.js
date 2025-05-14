import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';

const My_Tab = ({state, descriptors, navigation}) => {
  return (
    <View style={{height: 50}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}>
              <Text style={styles.tabText}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',

    height: 50,
  },
  tab: {
    padding: 15,
    marginRight: 40,
    height: 50,
    marginLeft: 20,
    width: 130,
  },
  activeTab: {
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#020202',
  },
});

export default My_Tab;
