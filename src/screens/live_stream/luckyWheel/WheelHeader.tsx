import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {truncateText} from '../../../utils/truncateText';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ProfileImage from '../component/ProfileImage';
import {UserProfile} from '../../../types/UserProfileData';
import WheelLuckInfo from './WheelLuckInfo';
import {useTranslation} from 'react-i18next';
import {wheelLuckGradient} from '../../../constants/colors';

const {width} = Dimensions.get('window');

interface WheelProfileHeaderProps {
  my_data: UserProfile;
}

const WheelProfileHeader: React.FC<WheelProfileHeaderProps> = ({my_data}) => {
  const {t} = useTranslation();
  const [showWheelLuckInfo, setShowWheelLuckInfo] = React.useState(false);

  return (
    <LinearGradient colors={wheelLuckGradient} style={styles.main_container}>
      <View style={styles.left_view}>
        <ProfileImage uri={my_data?.profile_pic} />
        <Text style={styles.nickname}>
          {truncateText(my_data?.nickname || '', 10)}
        </Text>
        <Text style={styles.username}>@{my_data?.username}</Text>
      </View>

      <Text style={styles.wheel_luck_text}>{t('WHEEL LUCK')}</Text>

      <Pressable
        style={styles.right_icon}
        onPress={() => setShowWheelLuckInfo(true)}>
        <SimpleLineIcons name="question" size={23} color={'#020202'} />
      </Pressable>

      <WheelLuckInfo
        show_model={showWheelLuckInfo}
        setShowModel={setShowWheelLuckInfo}
      />
    </LinearGradient>
  );
};

export default WheelProfileHeader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 85,
  },
  username: {
    fontSize: 8,
    color: '#020202',
    fontWeight: '600',
  },
  left_view: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: width * 0.25,
  },
  nickname: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '400',
  },
  wheel_luck_text: {
    fontSize: 25,
    color: '#020202',
    fontWeight: '900',
    width: width * 0.5,
    textAlign: 'center',
  },
  right_icon: {
    width: width * 0.25,
    alignItems: 'center',
  },
});
