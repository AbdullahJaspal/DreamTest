import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {ReactNode} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('screen');

interface HeaderProps {
  headertext?: string | ReactNode;
  thirdButton?: boolean;
  thirdButtonText?: string | ReactNode;
  onPress?: () => void;
  backPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  headertext,
  thirdButton,
  onPress,
  thirdButtonText,
  backPress,
}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const {t, i18n} = useTranslation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Index');
    }
  };

  return (
    <View style={styles.main_container}>
      <TouchableOpacity
        style={styles.arrow_button}
        onPress={backPress ? backPress : handleGoBack}>
        <AntDesign name="arrowleft" color={'#000'} size={25} />
      </TouchableOpacity>

      <View>
        {typeof headertext === 'string' ? (
          <Text style={styles.txt}>{headertext}</Text>
        ) : (
          headertext
        )}
      </View>

      {/* {thirdButton && (
        <Pressable onPress={onPress} style={styles.right_button}>
          {typeof thirdButtonText === 'string' ? (
            <Text style={{fontSize: 18, color: 'red'}}>{thirdButtonText}</Text>
          ) : (
            thirdButtonText || (
              <Text style={{fontSize: 18, color: 'red'}}>{t('Save')}</Text>
            )
          )}
        </Pressable>
      )} */}
      {thirdButton && (
        <Pressable
          onPress={() => {
            console.log('Header Button Pressed!'); // Debugging
            if (onPress) onPress();
          }}
          style={styles.right_button}>
          {typeof thirdButtonText === 'string' ? (
            <Text style={{fontSize: 18, color: 'red'}}>{thirdButtonText}</Text>
          ) : (
            <TouchableOpacity onPress={onPress}>
              {thirdButtonText}
            </TouchableOpacity>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  arrow_button: {
    position: 'absolute',
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  txt: {
    fontSize: 20,
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
  },
  right_button: {
    position: 'absolute',
    right: 15,
  },
});
