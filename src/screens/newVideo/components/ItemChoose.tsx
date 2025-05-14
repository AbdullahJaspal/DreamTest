import React, {useState} from 'react';
import {StyleSheet, View, Switch, GestureResponderEvent} from 'react-native';
import {BORDER, COLOR, SPACING, TEXT} from '../../../configs/styles';
import {Icon, CText} from '../../../components';
import {useTranslation} from 'react-i18next';
interface ItemChooseProps {
  iconLeft: any;
  name: string;
  iconRight?: any;
  type?: string;
  onChange?: (value: boolean) => void;
  initValue?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  value?: boolean;
}

const ItemChoose: React.FC<ItemChooseProps> = ({
  iconLeft,
  name,
  iconRight,
  type,
  onChange,
  initValue = false,
  onPress,
  value,
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initValue);
  const {t, i18n} = useTranslation();
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (onChange) {
      onChange(!isEnabled);
    }
  };

  return (
    <View style={styles.container}>
      <Icon source={iconLeft} width={24} height={24} tintColor={COLOR.BLACK} />

      <View style={styles.content}>
        <CText
          onPress={onPress}
          text={TEXT.REGULAR}
          fontSize={15}
          color={COLOR.BLACK}
          numberOfLines={1}>
          {t(name)}
        </CText>
        {type && (
          <CText
            width={120}
            onPress={onPress}
            marginRight={SPACING.S1}
            fontSize={12}>
            {t(type)}
          </CText>
        )}
      </View>

      <View style={styles.last_container}>
        {iconRight ? (
          <Icon
            source={iconRight}
            tintColor={COLOR.GRAY}
            width={20}
            height={20}
            onPress={onPress}
          />
        ) : (
          <Switch
            trackColor={{false: '#767577', true: 'red'}}
            thumbColor={isEnabled ? '#fff' : '##767577'}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch_view}
          />
        )}
      </View>
    </View>
  );
};

export default ItemChoose;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.S4,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconHashTag: {
    width: 30,
    height: 30,
    borderRadius: BORDER.PILL,
    borderWidth: 2,
    borderColor: COLOR.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginLeft: SPACING.S2,
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  last_container: {
    width: 30,
    alignItems: 'center',
  },
  switch_view: {
    marginRight: 10,
  },
});
