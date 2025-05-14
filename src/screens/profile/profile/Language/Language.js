// import React, { useState } from "react";
// import {
//   View, Text, FlatList, TouchableOpacity, TextInput,
//   StyleSheet, Alert, I18nManager
// } from "react-native";
// import { useTranslation } from "react-i18next";
// import Icon from 'react-native-vector-icons/Ionicons';
// import Header from '../components/Header';

// const Language = () => {
//   const { t, i18n } = useTranslation();
//   const [search, setSearch] = useState("");

//   // Only 5 available languages
//   const availableLanguages = [
//     { id: "1", name: "English", native: "English", code: "en" },
//     { id: "2", name: "Arabic", native: "العربية", code: "ar" },
//     { id: "3", name: "French", native: "Français", code: "fr" },
//     { id: "4", name: "German", native: "Deutsch", code: "de" },
//     { id: "5", name: "Hindi", native: "हिन्दी", code: "hi" },
//     { id: "6", name: "Chinese", native: "中文", code: "zh" },
//     { id: "7", name: "Urdu", native: "اردو", code: "ur" },
//   ];

//   // Default language is always English initially
//   const [selectedLanguages, setSelectedLanguages] = useState([availableLanguages[0]]);
//   const [currentLanguage, setCurrentLanguage] = useState("en");

//   const handleSelect = (language) => {
//     Alert.alert(
//       t("Confirm Language Change"),
//       `${t("Do you want to switch to")} ${language.native}?`,
//       [
//         {
//           text: t("Cancel"),
//           style: "cancel",
//         },
//         {
//           text: t("OK"),
//           onPress: () => switchLanguage(language),
//         },
//       ]
//     );
//   };

//   const switchLanguage = (language) => {
//     i18n.changeLanguage(language.code);
//     setCurrentLanguage(language.code);
//     setSelectedLanguages([language, ...selectedLanguages.filter(lang => lang.id !== language.id)]);

//     // Ensure RTL is disabled globally
//     I18nManager.allowRTL(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Header headertext={t('Language')} />

//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder={t("Search language")}
//         value={search}
//         onChangeText={setSearch}
//       />

//       {/* Default Language Display */}
//       <View style={styles.defaultLanguage}>
//         <Text style={styles.defaultLabel}>{t("Default Language")}</Text>
//         <Text style={styles.defaultText}>
//           {selectedLanguages[0].native} ({selectedLanguages[0].name})
//         </Text>
//       </View>

//       {/* Available Languages List */}
//       <FlatList
//         data={availableLanguages.filter(lang =>
//           lang.name.toLowerCase().includes(search.toLowerCase()) ||
//           lang.native.toLowerCase().includes(search.toLowerCase())
//         )}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleSelect(item)} style={styles.languageItem}>
//             <View>
//               <Text style={styles.languageName}>{item.native}</Text>
//               <Text style={styles.languageSubName}>{item.name}</Text>
//             </View>
//             <View style={styles.iconContainer}>
//               {selectedLanguages[0].id === item.id ? (
//                 <Text style={styles.selectedText}>✔</Text>
//               ) : (
//                 <TouchableOpacity onPress={() => handleSelect(item)}>
//                   <Icon name="add-circle-outline" size={24} color="black" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
//   searchBar: {
//     backgroundColor: "#FFF",
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   defaultLanguage: { padding: 15, backgroundColor: "#FFF", borderRadius: 8, marginBottom: 15 },
//   defaultLabel: { fontSize: 14, fontWeight: "bold", color: "#555" },
//   defaultText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
//   languageItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 15,
//     backgroundColor: "#FFF",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   languageName: { fontSize: 16, fontWeight: "bold" },
//   languageSubName: { fontSize: 14, color: "#777" },
//   iconContainer: { flexDirection: "row", alignItems: "center" },
//   selectedText: { fontSize: 18, fontWeight: "bold", color: "green" },
// });

// export default Language;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const Language = () => {
  const {t, i18n} = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const availableLanguages = [
    {id: '1', name: 'English', native: 'English', code: 'en'},
    {id: '2', name: 'Arabic', native: 'العربية', code: 'ar'},
    {id: '3', name: 'French', native: 'Français', code: 'fr'},
    {id: '4', name: 'German', native: 'Deutsch', code: 'de'},
    {id: '5', name: 'Hindi', native: 'हिन्दी', code: 'hi'},
    {id: '6', name: 'Chinese', native: '中文', code: 'zh'},
    {id: '7', name: 'Urdu', native: 'اردو', code: 'ur'},
  ];

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLangCode = await AsyncStorage.getItem('selectedLanguage');

      if (savedLangCode) {
        const savedLang = availableLanguages.find(
          lang => lang.code === savedLangCode,
        );
        if (savedLang) {
          setSelectedLanguage(savedLang);
          i18n.changeLanguage(savedLang.code);
          return;
        }
      }

      const deviceLang = RNLocalize.getLocales()[0]?.languageCode || 'en';
      const defaultLang =
        availableLanguages.find(lang => lang.code === deviceLang) ||
        availableLanguages[0];

      setSelectedLanguage(defaultLang);
      i18n.changeLanguage(defaultLang.code);
      await AsyncStorage.setItem('selectedLanguage', defaultLang.code);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  // const handleSelect = (language) => {
  //   Alert.alert(
  //     t("Confirm Language Change"),
  //     `${t("Do you want to switch to")} ${language.native}?`,
  //     [
  //       { text: t("Cancel"), style: "cancel" },
  //       { text: t("OK"), onPress: () => switchLanguage(language) },
  //     ]
  //   );
  // };
  const handleSelect = language => {
    if (['hi', 'zh', 'ur'].includes(language.code)) {
      Alert.alert(
        t('Coming Soon'),
        `${language.native} ${t('language will be implemented in future.')}`,
        [{text: t('OK')}],
      );
      return;
    }

    Alert.alert(
      t('Confirm Language Change'),
      `${t('Do you want to switch to')} ${language.native}?`,
      [
        {text: t('Cancel'), style: 'cancel'},
        {text: t('OK'), onPress: () => switchLanguage(language)},
      ],
    );
  };

  const switchLanguage = async language => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language.code);
      i18n.changeLanguage(language.code);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header headertext={t('Language')} />

      <TextInput
        style={styles.searchBar}
        placeholder={t('Search language')}
        value={search}
        onChangeText={setSearch}
      />

      {selectedLanguage && (
        <View style={styles.defaultLanguage}>
          <Text style={styles.defaultLabel}>{t('Default Language')}</Text>
          <Text style={styles.defaultText}>
            {selectedLanguage.native} ({selectedLanguage.name})
          </Text>
        </View>
      )}

      <FlatList
        data={availableLanguages.filter(
          lang =>
            lang.name.toLowerCase().includes(search.toLowerCase()) ||
            lang.native.toLowerCase().includes(search.toLowerCase()),
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={styles.languageItem}>
            <View>
              <Text style={styles.languageName}>{item.native}</Text>
              <Text style={styles.languageSubName}>{item.name}</Text>
            </View>
            <View style={styles.iconContainer}>
              {selectedLanguage?.code === item.code ? (
                <Text style={styles.selectedText}>✔</Text>
              ) : (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Icon name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F5F5F5'},
  searchBar: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultLanguage: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
  },
  defaultLabel: {fontSize: 14, fontWeight: 'bold', color: '#555'},
  defaultText: {fontSize: 16, fontWeight: 'bold', marginTop: 5},
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  languageName: {fontSize: 16, fontWeight: 'bold'},
  languageSubName: {fontSize: 14, color: '#777'},
  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  selectedText: {fontSize: 18, fontWeight: 'bold', color: 'green'},
});

export default Language;
