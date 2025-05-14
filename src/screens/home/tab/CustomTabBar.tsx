import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Container, Icon} from '../../../components';
import {COLOR, SPACING, TEXT} from '../../../configs/styles';
import {STATUSBAR_HEIGHT} from '../../../constants/constants';
import {useNavigation} from '@react-navigation/native';
import TopSectionList from '../components/TopSectionList';
import {HomeScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {icons} from '../../../assets/icons';
import {gifs} from '../../../assets/gifs';

interface CustomTabBarProps {
  data: string[];
  activeTabIndex: number;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  data,
  activeTabIndex,
  setActiveTabIndex,
}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();

  const pauseVideo = () => {
    console.log('Hey, guys will be clicking here');
  };

  const playVideo = () => {
    console.log('hey, i am wrting to express here something');
  };

  return (
    <Container
      backgroundColor={COLOR.TRANSPARENT}
      position="absolute"
      zIndex={11}
      top={-20}
      left={0}
      right={0}
      marginTop={STATUSBAR_HEIGHT}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={SPACING.S4}>
        <Icon source={gifs.live} width={55} height={55} />

        <Container flexDirection="row" alignItems="center">
          {data?.map((item, index) => {
            const opacity = activeTabIndex === index ? 1 : 0.5;
            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                style={styles.buttonView}
                onPress={() => setActiveTabIndex(index)}>
                <Text style={[styles.buttonText, {opacity}]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </Container>

        <Icon
          source={icons.search}
          width={26}
          height={26}
          tintColor={COLOR.WHITE}
          onPress={() => navigation.navigate('Discover')}
        />
      </Container>

      <TopSectionList
        pauseVideo={pauseVideo}
        playVideo={playVideo}
        user={undefined}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'capitalize',
    ...TEXT.STRONG,
  },
});

export default React.memo(CustomTabBar);
