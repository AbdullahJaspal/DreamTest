import React, {useMemo} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {StarIconProps} from './types/VideoData';
import {icons} from '../../assets/icons';

const StarIcon: React.FC<StarIconProps> = React.memo(
  ({no_of_star, show_yellow_icon}) => {
    const stars = useMemo(() => {
      const starElements = [];
      for (let i = 0; i < no_of_star; i++) {
        starElements.push(
          <Image key={i} source={icons.star} style={styles.starIcon} />,
        );
      }
      return starElements;
    }, [no_of_star]);

    return (
      <View style={styles.star_container}>
        <View style={styles.starsRow}>{stars}</View>
        {show_yellow_icon && (
          <Image source={icons.verified} style={styles.yellowIcon} />
        )}
      </View>
    );
  },
);

export default StarIcon;

const styles = StyleSheet.create({
  star_container: {
    position: 'absolute',
    left: 40,
    top: 10,
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  yellowIcon: {
    width: 60,
    height: 60,
  },
});
