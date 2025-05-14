import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import styles from '../styles/colorPickerStyles';
import {useAppSelector} from '../../../../store/hooks';
import {selectThemeSettings} from '../../../../store/selectors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TriangleColorPicker, fromHsv} from 'react-native-color-picker';
import {setChatThemeColor} from '../../../../store/slices/ui/themeSlice';
import Text from '../../../../components/Text';

const ColorPicker = ({visible, onClose, onSelectColor, initialColor}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  // Get theme color state from Redux
  const {chatThemeColor, recentColors} = useAppSelector(selectThemeSettings);

  // Use local state for UI interactions, but initialized from Redux
  const [selectedColor, setSelectedColor] = useState(
    initialColor || chatThemeColor,
  );
  const [activeTab, setActiveTab] = useState('presets');

  // Update local state if Redux state changes
  useEffect(() => {
    setSelectedColor(chatThemeColor);
  }, [chatThemeColor]);

  // Preset color options
  const presetColors = [
    {id: 'default', color: '#54AD7A', name: 'Default'},
    {id: 'blue', color: '#2196F3', name: 'Blue'},
    {id: 'purple', color: '#9C27B0', name: 'Purple'},
    {id: 'red', color: '#F44336', name: 'Red'},
    {id: 'orange', color: '#FF9800', name: 'Orange'},
    {id: 'pink', color: '#E91E63', name: 'Pink'},
    {id: 'teal', color: '#009688', name: 'Teal'},
    {id: 'indigo', color: '#3F51B5', name: 'Indigo'},
    {id: 'amber', color: '#FFC107', name: 'Amber'},
    {id: 'cyan', color: '#00BCD4', name: 'Cyan'},
    {id: 'lime', color: '#CDDC39', name: 'Lime'},
    {id: 'brown', color: '#795548', name: 'Brown'},
    {id: 'gray', color: '#607D8B', name: 'Gray'},
    {id: 'black', color: '#333333', name: 'Black'},
    {id: 'darkgreen', color: '#388E3C', name: 'Dark Green'},
  ];

  // Recent colors section that uses colors from Redux
  const recentColorsList = recentColors.map((color, index) => ({
    id: `recent-${index}`,
    color,
    name: 'Recent',
  }));

  const handleSelectPresetColor = color => {
    setSelectedColor(color);
  };

  const handleColorChange = color => {
    // Convert HSV to hex
    const hexColor = fromHsv(color);
    setSelectedColor(hexColor);
  };

  const handleApplyColor = () => {
    // Dispatch to Redux
    dispatch(setChatThemeColor(selectedColor));

    // Also call the original callback for backward compatibility
    if (onSelectColor) {
      onSelectColor(selectedColor);
    }

    onClose();
  };

  const renderColorOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.colorOption,
        {borderColor: selectedColor === item.color ? '#000' : 'transparent'},
      ]}
      onPress={() => handleSelectPresetColor(item.color)}>
      <View style={[styles.colorSwatch, {backgroundColor: item.color}]} />
      <Text style={styles.colorName}>
        {item.name === 'Recent' ? t('Recent') : t(item.name)}
      </Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={[styles.header, {backgroundColor: selectedColor}]}>
            <Text style={styles.title}>{t('Select Theme Color')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.selectedColorPreview}>
            <Text style={styles.previewText}>{t('Selected color:')}</Text>
            <View
              style={[styles.colorPreview, {backgroundColor: selectedColor}]}
            />
            <Text style={styles.hexValue}>{selectedColor.toUpperCase()}</Text>
          </View>

          {/* Tab selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'presets' && styles.activeTab]}
              onPress={() => setActiveTab('presets')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'presets' && styles.activeTabText,
                ]}>
                {t('Presets')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
              onPress={() => setActiveTab('recent')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'recent' && styles.activeTabText,
                ]}>
                {t('Recent')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
              onPress={() => setActiveTab('custom')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'custom' && styles.activeTabText,
                ]}>
                {t('Custom')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll}>
            {activeTab === 'presets' && (
              <FlatList
                data={presetColors}
                renderItem={renderColorOption}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.presetColorsContainer}
                numColumns={3}
                scrollEnabled={false}
              />
            )}

            {activeTab === 'recent' && (
              <FlatList
                data={recentColorsList}
                renderItem={renderColorOption}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.presetColorsContainer}
                numColumns={3}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>{t('No recent colors')}</Text>
                )}
              />
            )}

            {activeTab === 'custom' && (
              <View style={styles.customPickerContainer}>
                {/* Triangle Color Picker */}
                <TriangleColorPicker
                  style={styles.trianglePicker}
                  defaultColor={selectedColor}
                  onColorChange={handleColorChange}
                  hideControls={false}
                />
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.applyButton, {backgroundColor: selectedColor}]}
            onPress={handleApplyColor}>
            <Text style={styles.applyButtonText}>{t('Apply')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ColorPicker;
