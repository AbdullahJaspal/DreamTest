import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {SetStateAction} from 'react';
import {COLOR} from '../../../configs/styles';
import {useTranslation} from 'react-i18next';
interface PostPictureInputBoxProps {
  description: string;
  setDescription: React.Dispatch<SetStateAction<string>>;
}

const {width, height} = Dimensions.get('screen');

const PostPictureInputBox: React.FC<PostPictureInputBoxProps> = ({
  description,
  setDescription,
}) => {
  function handleChangeText(text: string): void {
    setDescription(text);
  }
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.main_container}>
      <TextInput
        style={[styles.input]}
        placeholder={t(
          'Describe the post, add a hashtag, or hit the creators who inspire you.',
        )}
        textAlignVertical="top"
        onChangeText={handleChangeText}
        // maxLength={100}
        multiline={true}>
        <Text>{description}</Text>
      </TextInput>
    </View>
  );
};

export default PostPictureInputBox;

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLOR.WHITE,
    width: width - 30,
    fontWeight: '500',
    marginVertical: 2,
    paddingHorizontal: 10,
    paddingVertical: 30,
    fontSize: 14,
    lineHeight: 18,
  },
  main_container: {
    marginTop: 10,
  },
});
