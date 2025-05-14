import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NavigationHelpers, TabNavigationState} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/core';
import {MaterialTopTabNavigationEventMap} from '@react-navigation/material-top-tabs';
import {MaterialTopTabDescriptorMap} from '@react-navigation/material-top-tabs/lib/typescript/src/types';

// Components
import {Container, Icon} from '../../../components';
import Indicator from '../../../components/Tabs/Indicator';
import Tab from './Tab';

// Config & Constants
import {COLOR, SPACING} from '../../../configs/styles';
import {STATUSBAR_HEIGHT} from '../../../constants/constants';

// Redux
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

// Types
type TabMeasurement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RouteWithRef = {
  key: string;
  name: string;
  ref: React.RefObject<any>;
  [key: string]: any;
};

type MyTabBarProps = {
  layout: any;
  position: any;
  jumpTo: (key: string) => void;
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
  descriptors: MaterialTopTabDescriptorMap;
};

const MEASUREMENT_DELAY = 500;
const INDICATOR_WIDTH = 40;
const PLACEHOLDER_WIDTH = 55;
const PLACEHOLDER_HEIGHT = 40;
const SEARCH_ICON_SIZE = 26;

const MyTabBar: React.FC<MyTabBarProps> = ({
  state,
  descriptors,
  navigation,
  position,
}) => {
  const routes: RouteWithRef[] = state.routes.map(route => ({
    ...route,
    ref: useRef<any>(null),
  }));

  const containerRef = useRef<any>(null);
  const [measures, setMeasures] = useState<TabMeasurement[]>([]);

  useEffect(() => {
    const measurementTimer = setTimeout(() => {
      measureTabs();
    }, MEASUREMENT_DELAY);

    return () => clearTimeout(measurementTimer);
  }, [routes.length]);

  const measureTabs = () => {
    if (!containerRef.current) return;

    const measurements: TabMeasurement[] = [];

    const measureCallback =
      (index: number) =>
      (x: number, y: number, width: number, height: number) => {
        measurements[index] = {x, y, width, height};

        if (measurements.filter(Boolean).length === routes.length) {
          setMeasures(measurements);
        }
      };

    routes.forEach((route, index) => {
      if (route.ref?.current && containerRef.current) {
        route.ref.current.measureLayout(
          containerRef.current,
          measureCallback(index),
          () => console.log(`Failed to measure tab ${index}`),
        );
      }
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('DiscoverScreen');
  };

  return (
    <Container
      backgroundColor={COLOR.TRANSPARENT}
      position="absolute"
      zIndex={1}
      top={0}
      left={0}
      right={0}
      marginTop={STATUSBAR_HEIGHT}>
      <Container
        ref={containerRef}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={SPACING.S4}>
        <View style={{width: PLACEHOLDER_WIDTH, height: PLACEHOLDER_HEIGHT}} />

        <Container flexDirection="row" alignItems="center">
          {routes.map((route, index) => (
            <Tab
              key={route.key}
              descriptors={descriptors}
              index={index}
              navigation={navigation}
              position={position}
              route={route}
              state={state}
              ref={route.ref}
            />
          ))}
        </Container>

        <Icon
          source={icons.search}
          width={SEARCH_ICON_SIZE}
          height={SEARCH_ICON_SIZE}
          tintColor={COLOR.WHITE}
          onPress={handleSearchPress}
        />
      </Container>

      {measures.length > 0 && (
        <Indicator
          measures={measures}
          position={position}
          width={INDICATOR_WIDTH}
        />
      )}
    </Container>
  );
};

export default React.memo(MyTabBar);
