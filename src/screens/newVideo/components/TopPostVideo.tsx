import {StyleSheet, Image, TextInput, Text} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Container, CText} from '../../../components';
import {BORDER, COLOR, SPACING} from '../../../configs/styles';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {PostVideoScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {View} from 'react-native';
import DescriptionTextParser from './DescriptionTextParser';
import {useTranslation} from 'react-i18next';
interface TopPostVideoProps {
  pathVideo: string;
  durations: number;
  image: string;
  onTitleChange: (txt: string) => void;
  onCoverChange: (img: string) => void;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  setShowTagModel: Dispatch<SetStateAction<boolean>>;
}

const TopPostVideo: React.FC<TopPostVideoProps> = ({
  pathVideo,
  durations,
  image,
  onTitleChange,
  onCoverChange,
  description,
  setDescription,
  setShowTagModel,
}) => {
  const navigation = useNavigation<PostVideoScreenNavigationProps>();
  const {t, i18n} = useTranslation();
  const [title, setTitle] = useState<string>('');

  const handleEditCover = () => {
    navigation.navigate('CoverPicScreen', {
      pathVideo,
      onCoverChange,
      durations,
    });
  };

  function handleTitleChange(text: string): void {
    if (text.length <= 15) {
      setTitle(text);
      onTitleChange(text);
    } else {
      Toast.show(
        t('You can write a maximum of 15 characters in the title'),
        Toast.LONG,
      );
    }
  }

  function handleChangeText(text: string): void {
    if (text.length <= 1000) {
      const words = text.split(/\s+/);
      const lastWord = words[words.length - 1];

      if (lastWord.startsWith('@')) {
        setShowTagModel(true);
      } else {
        setDescription(text);
      }
    } else {
      Toast.show(
        t('You can write a maximum of 1000 characters in the description'),
        Toast.LONG,
      );
    }
  }

  return (
    <View style={styles.main_container}>
      <Container
        height={140}
        width={90}
        borderRadius={BORDER.SMALL}
        backgroundColor={'transparent'}
        overflow="hidden">
        <Image source={{uri: image}} style={styles.video} />
        <Container
          position="absolute"
          backgroundColor={COLOR.setOpacity(COLOR.BLACK, 0.3)}
          bottom={0}
          left={0}
          right={0}
          paddingVertical={SPACING.S2}
          overflow="hidden">
          <CText
            color={COLOR.WHITE}
            textAlign="center"
            fontSize={12}
            onPress={handleEditCover}>
            {t('Edit cover photo')}
          </CText>
        </Container>
      </Container>

      <Container flex={1} marginLeft={SPACING.S2}>
        <Text style={styles.title_txt}>{t('Short Title')}</Text>

        <TextInput
          style={[styles.input, {fontSize: 14}]}
          placeholder={t('Add the title to the content')}
          textAlignVertical="top"
          onChangeText={handleTitleChange}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          maxLength={16}
          multiline={true}>
          <Text>{title}</Text>
        </TextInput>

        <Text style={styles.title_txt}>{t('Description')}</Text>

        <TextInput
          style={[styles.input, {fontSize: 11}]}
          placeholder={t(
            'Describe the post, add a hashtag, or hit the creators who inspire you',
          )}
          textAlignVertical="top"
          onChangeText={handleChangeText}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          maxLength={1001}
          multiline={true}>
          <DescriptionTextParser text={description} />
        </TextInput>
      </Container>
    </View>
  );
};

export default TopPostVideo;

const styles = StyleSheet.create({
  video: {
    flex: 1,
    borderRadius: BORDER.SMALL,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: COLOR.WHITE,
    fontWeight: '600',
    marginVertical: 2,
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title_txt: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
    lineHeight: 22,
  },
  main_container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'flex-start',
  },
});
