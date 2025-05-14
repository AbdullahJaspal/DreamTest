import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import AddSoundModel from './AddSoundModel';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import Entypo from 'react-native-vector-icons/Entypo';
import {truncateText} from '../../../utils/truncateText';
import {COLOR, TEXT} from '../../../configs/styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {selectExternalAudio} from '../../../store/selectors';
import {
  addNickname,
  addExternalAudio,
  setSoundRemoteUrl,
} from '../../../store/slices/content/externalSoundSlice';

interface AddsoundProps {
  onRemoveSound?: () => void;
}

const Addsound: React.FC<AddsoundProps> = ({onRemoveSound}) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const selected_sound = useAppSelector(selectExternalAudio);
  const [isModelVisible, setIsModelVisible] = useState<boolean>(false);

  const handleCrossPress = () => {
    dispatch(addNickname(null));
    dispatch(addExternalAudio(null));
    dispatch(setSoundRemoteUrl(null));
    if (onRemoveSound) {
      onRemoveSound();
    }
  };

  const handleOpen = () => {
    setIsModelVisible(true);
  };

  return (
    <Pressable style={styles.container} onPress={handleOpen}>
      <View style={styles.sound_wraper}>
        <Ionicons name="musical-notes-outline" size={20} color="#fff" />

        <Text style={styles.text}>
          {selected_sound?.nickname
            ? truncateText(selected_sound?.nickname, 6)
            : t('Add Sound')}
        </Text>

        {selected_sound?.nickname ? (
          <TouchableOpacity
            style={styles.nickname_view}
            onPress={handleCrossPress}>
            <Entypo name="cross" size={20} color={'#fff'} />
          </TouchableOpacity>
        ) : null}
      </View>

      <AddSoundModel
        setIsModelVisible={setIsModelVisible}
        isModelVisible={isModelVisible}
      />
    </Pressable>
  );
};

export default React.memo(Addsound);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
  text: {
    ...TEXT.SMALL,
    color: COLOR.WHITE,
    marginLeft: 5,
  },
  sound_wraper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#544e4a',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nickname_view: {
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
    marginLeft: 3,
  },
});
