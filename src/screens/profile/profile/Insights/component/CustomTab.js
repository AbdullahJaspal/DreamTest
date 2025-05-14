import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';

const CustomTab = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.tabWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}>
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
              <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centers all tabs horizontally
    alignItems: 'center', // Aligns tabs vertically
  },
  tab: {
    paddingHorizontal: 20, // Increased padding for uniform spacing
    paddingVertical: 10,
    marginHorizontal: 5, // Adjusts spacing between tabs
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#020202',
  },
  activeTabText: {
    color: 'red',
  },
});

export default CustomTab;
