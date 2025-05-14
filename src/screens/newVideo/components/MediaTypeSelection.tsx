import React, {useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {MediaType} from '../enum/MediaType';
import {useTranslation} from 'react-i18next';
interface CustomDropdownProps {
  items: MediaType[];
  onSelect: (selectedItem: MediaType) => void;
  dropdownStyle?: StyleProp<ViewStyle>;
  dropdownContent?: (selectedValue: string) => React.ReactNode;
}

const MediaTypeSelection: React.FC<CustomDropdownProps> = memo(
  ({items, onSelect, dropdownStyle, dropdownContent}) => {
    const [isVisible, setIsVisible] = useState(false);
    const {t, i18n} = useTranslation();
    const [selectedValue, setSelectedValue] = useState(t('Select an item'));

    const handleItemPress = useCallback(
      (item: MediaType) => {
        setSelectedValue(item);
        setIsVisible(false);
        onSelect(item);
      },
      [onSelect],
    );

    const renderDropdownItem = useCallback(
      ({item}: {item: MediaType}) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleItemPress(item)}>
          <Text
            style={[
              styles.itemText,
              selectedValue === item && styles.selectedItem,
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ),
      [handleItemPress, selectedValue],
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.dropdown, dropdownStyle]}
          onPress={() => setIsVisible(true)}
          activeOpacity={0.7}>
          {dropdownContent ? (
            dropdownContent(selectedValue)
          ) : (
            <Text>{selectedValue}</Text>
          )}
        </TouchableOpacity>

        {isVisible && (
          <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => setIsVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={items}
                  keyExtractor={item => item}
                  renderItem={renderDropdownItem}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  horizontal={true}
                  windowSize={5}
                  getItemLayout={(data, index) => ({
                    length: 50,
                    offset: 50 * index,
                    index,
                  })}
                />
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    (selectedValue === 'VIDEOS' ||
                      selectedValue === 'IMAGES') &&
                      styles.dangerButton,
                  ]}
                  onPress={() => setIsVisible(false)}>
                  <Text style={styles.closeButtonText}>{t('Close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  },
);

export default memo(MediaTypeSelection);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    marginTop: 80,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    backgroundColor: '#545353',
    marginHorizontal: 50,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  item: {
    padding: 15,
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  selectedItem: {
    color: 'lightblue',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    width: 200,
    backgroundColor: '#fff',
  },
  dangerButton: {
    backgroundColor: 'red',
  },
  closeButtonText: {
    color: '#000',
  },
});
