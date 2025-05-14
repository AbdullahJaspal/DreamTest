import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React from 'react';

interface ItemProps {
  title: string;
  total_no: number;
  img: any;
}

interface RenderFavTabListProps {
  item: ItemProps;
  index: number;
  setSelected_tab: any;
  selected_tab: string;
}

const {width} = Dimensions.get('screen');

const RenderFavTabList: React.FC<RenderFavTabListProps> = ({
  item,
  index,
  selected_tab,
  setSelected_tab,
}) => {
  const {t, i18n} = useTranslation();

  const handleTabPress = async () => {
    setSelected_tab(item?.title);
  };

  return (
    <TouchableOpacity
      onPress={handleTabPress}
      style={[
        styles.item_container,
        {
          borderBottomWidth: item.title === selected_tab ? 3 : 0,
        },
      ]}>
      <Text style={styles.item_txt}>
        {item?.title}({item.total_no})
      </Text>
    </TouchableOpacity>
  );
};

export default RenderFavTabList;

const styles = StyleSheet.create({
  item_container: {
    width: width / 4.8,
    backgroundColor: '#fff',
    marginHorizontal: 3,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'red',
    flexDirection: 'row',
  },
  item_txt: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  icon_img: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
