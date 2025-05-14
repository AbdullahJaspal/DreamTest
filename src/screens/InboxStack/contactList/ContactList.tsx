import React, {useState, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image,
  SectionList,
} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {selectChatThemeColor} from '../../../store/selectors';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/**
 * Interface for contact object
 */
interface Contact {
  recordID: string;
  displayName: string;
  givenName?: string;
  familyName?: string;
  phoneNumbers?: {
    label: string;
    number: string;
  }[];
  thumbnailPath?: string;
  hasThumbnail?: boolean;
  [key: string]: any;
}

const ContactList: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const chatThemeColor = useAppSelector(selectChatThemeColor);

  // Get contacts data from route params
  const contacts: Contact[] = route.params?.data || [];
  const onContactSelect = route.params?.onContactSelect;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Filter contacts based on search query - memoized
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => {
      const displayName = contact.displayName?.toLowerCase() || '';
      const givenName = contact.givenName?.toLowerCase() || '';
      const familyName = contact.familyName?.toLowerCase() || '';

      return (
        displayName.includes(query) ||
        givenName.includes(query) ||
        familyName.includes(query) ||
        contact.phoneNumbers?.some(phone =>
          phone.number.toLowerCase().includes(query),
        )
      );
    });
  }, [contacts, searchQuery]);

  // Group contacts alphabetically - memoized
  const groupedContacts = useMemo(() => {
    const groups: {[key: string]: Contact[]} = {};

    filteredContacts.forEach(contact => {
      const firstLetter = (contact.displayName || contact.givenName || '#')
        .charAt(0)
        .toUpperCase();
      // Use regex to check if it's a letter
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(contact);
    });

    // Sort each group alphabetically
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const nameA = a.displayName || a.givenName || '';
        const nameB = b.displayName || b.givenName || '';
        return nameA.localeCompare(nameB);
      });
    });

    // Convert to array of { title, data } for section list
    return Object.keys(groups)
      .sort((a, b) => {
        // # comes last
        if (a === '#') return 1;
        if (b === '#') return -1;
        return a.localeCompare(b);
      })
      .map(key => ({
        title: key,
        data: groups[key],
      }));
  }, [filteredContacts]);

  // Handle contact selection
  const handleContactPress = useCallback((contact: Contact) => {
    // If contact has multiple phone numbers, show selection
    if (contact.phoneNumbers && contact.phoneNumbers.length > 1) {
      setSelectedContact(contact);
      setSelectedPhone(null);
    } else if (contact.phoneNumbers && contact.phoneNumbers.length === 1) {
      // If contact has only one phone number, select it directly
      handleConfirmContact(contact, contact.phoneNumbers[0].number);
    } else {
      // If contact has no phone numbers, select it anyway
      handleConfirmContact(contact, null);
    }
  }, []);

  // Handle phone number selection
  const handlePhoneSelect = useCallback((phone: string) => {
    setSelectedPhone(phone);
  }, []);

  // Confirm contact selection and return to chat
  const handleConfirmContact = useCallback(
    (contact: Contact, phoneNumber: string | null) => {
      if (isSelecting) return;

      setIsSelecting(true);

      try {
        // Create contact data to return
        const contactData = {
          id: contact.recordID,
          displayName:
            contact.displayName ||
            `${contact.givenName || ''} ${contact.familyName || ''}`.trim(),
          phoneNumber: phoneNumber,
          thumbnailPath: contact.thumbnailPath,
        };

        // Call the callback from route params
        if (onContactSelect) {
          onContactSelect(contactData);
        }

        // Navigate back to chat
        navigation.goBack();
      } catch (error) {
        console.error('Error selecting contact:', error);
        setIsSelecting(false);
      }
    },
    [isSelecting, navigation, onContactSelect],
  );

  // Clear selected contact
  const handleCancelPhoneSelection = useCallback(() => {
    setSelectedContact(null);
    setSelectedPhone(null);
  }, []);

  // Render individual contact item
  const renderContactItem = useCallback(
    ({item}: {item: Contact}) => {
      const hasPhoneNumbers = item.phoneNumbers && item.phoneNumbers.length > 0;

      return (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress(item)}
          disabled={isSelecting}
          activeOpacity={0.7}>
          <View style={styles.contactImage}>
            {item.hasThumbnail && item.thumbnailPath ? (
              <Image
                source={{uri: item.thumbnailPath}}
                style={styles.avatarImage}
              />
            ) : (
              <MaterialIcons name="person" size={28} color="#888" />
            )}
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactName} numberOfLines={1}>
              {item.displayName ||
                `${item.givenName || ''} ${item.familyName || ''}`.trim() ||
                t('No Name')}
            </Text>

            {hasPhoneNumbers && (
              <Text style={styles.contactPhone} numberOfLines={1}>
                {item.phoneNumbers[0].number}
                {item.phoneNumbers.length > 1 &&
                  ` (+${item.phoneNumbers.length - 1} ${t('more')})`}
              </Text>
            )}
          </View>

          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      );
    },
    [handleContactPress, isSelecting, t],
  );

  // Render section header (alphabet letter)
  const renderSectionHeader = useCallback(
    ({section}) => (
      <View style={[styles.sectionHeader, {borderBottomColor: chatThemeColor}]}>
        <Text style={[styles.sectionHeaderText, {color: chatThemeColor}]}>
          {section.title}
        </Text>
      </View>
    ),
    [chatThemeColor],
  );

  // Render phone selection modal
  const renderPhoneSelectionModal = useCallback(() => {
    if (!selectedContact) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('Select a phone number')}</Text>
          </View>

          <FlatList
            data={selectedContact.phoneNumbers || []}
            keyExtractor={(item, index) => `phone-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.phoneItem,
                  selectedPhone === item.number && [
                    styles.selectedPhoneItem,
                    {backgroundColor: `${chatThemeColor}20`},
                  ],
                ]}
                onPress={() => handlePhoneSelect(item.number)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.phoneIconContainer,
                    {backgroundColor: `${chatThemeColor}20`},
                  ]}>
                  <MaterialIcons
                    name={item.label === 'mobile' ? 'smartphone' : 'phone'}
                    size={22}
                    color={chatThemeColor}
                  />
                </View>

                <View style={styles.phoneInfo}>
                  <Text style={styles.phoneLabel}>
                    {item.label || t('Phone')}
                  </Text>
                  <Text style={styles.phoneNumber}>{item.number}</Text>
                </View>

                {selectedPhone === item.number && (
                  <MaterialIcons
                    name="check"
                    size={22}
                    color={chatThemeColor}
                  />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.phoneList}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleCancelPhoneSelection}
              activeOpacity={0.7}>
              <Text style={styles.modalCancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                !selectedPhone && styles.disabledButton,
                selectedPhone && {backgroundColor: chatThemeColor},
              ]}
              onPress={() =>
                selectedPhone &&
                handleConfirmContact(selectedContact, selectedPhone)
              }
              disabled={!selectedPhone || isSelecting}
              activeOpacity={0.7}>
              {isSelecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalConfirmText}>{t('Select')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [
    selectedContact,
    selectedPhone,
    isSelecting,
    handlePhoneSelect,
    handleCancelPhoneSelection,
    handleConfirmContact,
    chatThemeColor,
    t,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('Select Contact')}</Text>

        <View style={styles.placeholderButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={22}
          color="#999"
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('Search contacts')}
          placeholderTextColor="#999"
          returnKeyType="search"
        />

        {searchQuery !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
            activeOpacity={0.7}>
            <MaterialIcons name="close" size={22} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contact List */}
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="person-search" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('No contacts found')}</Text>
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {t('No contacts matching "{{query}}"', {query: searchQuery})}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={groupedContacts}
          renderItem={renderContactItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.recordID}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      )}

      {/* Phone Selection Modal */}
      {selectedContact && renderPhoneSelectionModal()}
    </SafeAreaView>
  );
};

export default ContactList;
