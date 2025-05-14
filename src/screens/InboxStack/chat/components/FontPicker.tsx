import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAvailableFonts,
  selectRecentFonts,
  selectSelectedFont,
  selectFontSizeScale,
  setSelectedFont,
  setFontSizeScale,
} from '../../../../store/slices/ui/fontSlice';
import Text from '../../../../components/Text';

const FontPicker = ({visible, onClose}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  // Get font data from Redux
  const availableFonts = useSelector(selectAvailableFonts);
  const recentFonts = useSelector(selectRecentFonts);
  const currentFont = useSelector(selectSelectedFont);
  const fontSizeScale = useSelector(selectFontSizeScale);

  // Local state
  const [activeTab, setActiveTab] = useState('english');
  const [selectedFont, setSelectedFontLocal] = useState(currentFont);
  const [searchTerm, setSearchTerm] = useState('');
  const [localFontSizeScale, setLocalFontSizeScale] = useState(fontSizeScale);

  // Determine initial tab based on app language
  useEffect(() => {
    if (visible) {
      const currentLanguage = i18n.language;
      if (currentLanguage.startsWith('ar')) {
        setActiveTab('arabic');
      } else {
        setActiveTab('english');
      }

      setSelectedFontLocal(currentFont);
      setSearchTerm('');
      setLocalFontSizeScale(fontSizeScale);
    }
  }, [visible, currentFont, i18n.language, fontSizeScale]);

  // Get fonts based on active tab and search term
  const filteredFonts = useMemo(() => {
    const fontsToFilter =
      activeTab === 'recent' ? recentFonts : availableFonts[activeTab];

    if (!searchTerm) return fontsToFilter;

    return fontsToFilter.filter(font =>
      font.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeTab, availableFonts, recentFonts, searchTerm]);

  const handleSelectFont = font => {
    setSelectedFontLocal(font);
  };

  const handleApply = () => {
    dispatch(setSelectedFont(selectedFont));

    // Apply font size scale if changed
    if (localFontSizeScale !== fontSizeScale) {
      dispatch(setFontSizeScale(localFontSizeScale));
    }

    onClose();
  };

  const adjustFontSize = increase => {
    const increment = 0.05;
    const min = 0.8;
    const max = 1.5;

    setLocalFontSizeScale(prevScale => {
      const newScale = increase
        ? Math.min(prevScale + increment, max)
        : Math.max(prevScale - increment, min);
      return Math.round(newScale * 100) / 100;
    });
  };

  const renderFontOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.fontOption,
        selectedFont.id === item.id && styles.selectedFontOption,
      ]}
      onPress={() => handleSelectFont(item)}>
      <Text
        style={[
          styles.fontName,
          selectedFont.id === item.id && styles.selectedFontText,
        ]}
        useSelectedFont={false}>
        <Text style={{fontFamily: item.fontFamily}} useSelectedFont={false}>
          {item.name}
        </Text>
      </Text>
      {selectedFont.id === item.id && (
        <MaterialIcons name="check" size={18} color="#FFF" />
      )}
    </TouchableOpacity>
  );

  // Sample text for different languages
  const getPreviewText = () => {
    if (activeTab === 'arabic') {
      return 'مرحبا! هذا نص تجريبي.';
    }
    return 'Hello! This is a preview text.';
  };

  const previewDirection = activeTab === 'arabic' ? 'rtl' : 'ltr';
  const previewAlign = activeTab === 'arabic' ? 'right' : 'left';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title} useSelectedFont={false}>
              {t('Select Font')}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Preview section */}
          <View style={styles.previewContainer}>
            <Text
              style={[
                styles.previewText,
                {
                  fontFamily: selectedFont?.fontFamily,
                  textAlign: previewAlign,
                  writingDirection: previewDirection,
                  fontSize: 16 * localFontSizeScale,
                },
              ]}
              useSelectedFont={false}>
              {getPreviewText()}
            </Text>

            {/* Font size controls */}
            <View style={styles.fontSizeControls}>
              <Text style={styles.fontSizeLabel} useSelectedFont={false}>
                {t('Font Size')}
              </Text>
              <View style={styles.fontSizeButtons}>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() => adjustFontSize(false)}
                  disabled={localFontSizeScale <= 0.8}>
                  <MaterialIcons
                    name="remove"
                    size={20}
                    color={localFontSizeScale <= 0.8 ? '#CCC' : '#54AD7A'}
                  />
                </TouchableOpacity>
                <Text style={styles.fontSizeText} useSelectedFont={false}>
                  {Math.round(localFontSizeScale * 100)}%
                </Text>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() => adjustFontSize(true)}
                  disabled={localFontSizeScale >= 1.5}>
                  <MaterialIcons
                    name="add"
                    size={20}
                    color={localFontSizeScale >= 1.5 ? '#CCC' : '#54AD7A'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('Search fonts...')}
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm ? (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <MaterialIcons name="clear" size={20} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Tab selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'english' && styles.activeTab]}
              onPress={() => setActiveTab('english')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'english' && styles.activeTabText,
                ]}
                useSelectedFont={false}>
                {t('English')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'arabic' && styles.activeTab]}
              onPress={() => setActiveTab('arabic')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'arabic' && styles.activeTabText,
                ]}
                useSelectedFont={false}>
                {t('Arabic')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
              onPress={() => setActiveTab('recent')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'recent' && styles.activeTabText,
                ]}
                useSelectedFont={false}>
                {t('Recent')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Font list - using View instead of ScrollView to fix rendering issues */}
          <View style={styles.listContainer}>
            <ScrollView>
              {filteredFonts.length > 0 ? (
                filteredFonts.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.fontOption,
                      selectedFont.id === item.id && styles.selectedFontOption,
                    ]}
                    onPress={() => handleSelectFont(item)}>
                    <Text
                      style={[
                        styles.fontName,
                        selectedFont.id === item.id && styles.selectedFontText,
                      ]}
                      useSelectedFont={false}>
                      <Text
                        style={{fontFamily: item.fontFamily}}
                        useSelectedFont={false}>
                        {item.name}
                      </Text>
                    </Text>
                    {selectedFont.id === item.id && (
                      <MaterialIcons name="check" size={18} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyMessage} useSelectedFont={false}>
                  {searchTerm
                    ? t('No fonts matching your search')
                    : activeTab === 'recent'
                    ? t('No recently used fonts')
                    : t('No fonts available')}
                </Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText} useSelectedFont={false}>
                {t('Cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText} useSelectedFont={false}>
                {t('Apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#54AD7A',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 4,
  },
  previewContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  fontSizeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  fontSizeLabel: {
    fontSize: 14,
    color: '#666',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  fontSizeText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 8,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#54AD7A',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#54AD7A',
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: 300,
    paddingVertical: 8,
    overflow: 'scroll',
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedFontOption: {
    backgroundColor: '#54AD7A',
  },
  fontName: {
    fontSize: 16,
    color: '#333',
  },
  selectedFontText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyMessage: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#54AD7A',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FontPicker;
