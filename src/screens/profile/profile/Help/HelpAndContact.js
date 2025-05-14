// import React, { useState } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     Dimensions,
//     TouchableOpacity,
//     ScrollView,
//     StatusBar,
// } from 'react-native';
// import Header from '../components/Header';
// import { useTranslation } from 'react-i18next';

// const { width } = Dimensions.get('window');

// // Accordion item component
// const AccordionItem = ({ question, answer }) => {
//     const [isExpanded, setIsExpanded] = useState(false);

//     return (
//         <View style={styles.accordionItem}>
//             <TouchableOpacity
//                 onPress={() => setIsExpanded(!isExpanded)}
//                 style={styles.accordionHeader}>
//                 <Text style={styles.questionText}>{question}</Text>
//                 <Text style={styles.expandIcon}>{isExpanded ? '-' : '+'}</Text>
//             </TouchableOpacity>
//             {isExpanded && <Text style={styles.answerText}>{answer}</Text>}
//         </View>
//     );
// };

// const HelpAndContact = () => {
//     const { t } = useTranslation();
//     const faqData = [
//         {
//             question: 'What is Lucky Wheel?',
//             answer: 'Lucky Wheel is an exciting lottery-style feature that allows users to win rewards by spinning a wheel.',
//         },
//         {
//             question: 'How do I participate?',
//             answer: 'You can participate by purchasing tickets, which will give you a chance to win amazing rewards.',
//         },
//         {
//             question: 'What if I forgot my password?',
//             answer: 'You can reset your password by selecting the "Forgot Password" option on the login screen.',
//         },
//     ]
//     return (
//         <View style={styles.mainContainer}>
//             <Header headertext={t('Q&A')} />
//             <ScrollView style={styles.scrollContainer}>
//                 <Text style={styles.title}>{t('Frequently Asked Questions')}</Text>
//                 {faqData?.length > 0 ? (
//                     faqData.map((item, index) => (
//                         <AccordionItem
//                             key={index}
//                             question={item.question}
//                             answer={item.answer}
//                         />
//                     ))
//                 ) : (
//                     <View style={styles.content}>
//                         <Text style={styles.message}>{t('No data available')}</Text>
//                     </View>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };

// export default HelpAndContact;

// const styles = StyleSheet.create({
//     mainContainer: {
//         paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     scrollContainer: {
//         paddingHorizontal: 20,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//         marginVertical: 20,
//         textAlign: 'center',
//     },
//     content: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 50,
//     },
//     message: {
//         fontSize: 16,
//         color: '#666',
//     },
//     accordionItem: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         paddingVertical: 15,
//     },
//     accordionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     questionText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         maxWidth: width * 0.85,
//     },
//     expandIcon: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#666',
//     },
//     answerText: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 10,
//         lineHeight: 20,
//     },
// });

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';

const HelpAndContact = () => {
  const {t} = useTranslation();

  // Function to handle email or URL link
  const handleLinkPress = link => {
    // Check if it's an email or URL and open the corresponding app
    if (link.includes('@')) {
      Linking.openURL(`mailto:${link}`).catch(err =>
        console.error('Failed to open email app:', err),
      );
    } else {
      // Open URL in browser
      Linking.openURL(`https://${link}`).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  // Function to handle phone link
  const handlePhonePress = phone => {
    Linking.openURL(`tel:${phone}`).catch(err =>
      console.error('Failed to open phone app:', err),
    );
  };

  // Function to handle WhatsApp link
  const handleWhatsAppPress = phone => {
    Linking.openURL(`whatsapp://send?phone=${phone}`).catch(err =>
      console.error('Failed to open WhatsApp:', err),
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* GeneralChange */}
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{t('Contact Information')}</Text>

        {/* Email Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('Emails')}:</Text>
          <TouchableOpacity
            onPress={() => handleLinkPress('dream.com.intenet@gmail.com')}>
            <Text style={styles.linkText}>
              dream.com.intenet@gmail.com (contact us)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLinkPress('dreamservicing1@gmail.com')}>
            <Text style={styles.linkText}>
              dreamservicing1@gmail.com (support management)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress('dreamlived.com')}>
            <Text style={styles.linkText}>dreamlived.com</Text>
          </TouchableOpacity>
        </View>

        {/* Phone Support Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('Phone Support')}:</Text>
          <TouchableOpacity onPress={() => handlePhonePress('+4915205883082')}>
            <Text style={styles.linkText}>+49 1520 5883082 (Team dream)</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            {t('Note')}: Calls will be recorded with both audio and video for
            quality and security purposes.
          </Text>
        </View>

        {/* WhatsApp Support Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('WhatsApp Support')}:</Text>
          <TouchableOpacity
            onPress={() => handleWhatsAppPress('00905318199741')}>
            <Text style={styles.linkText}>+90 531 819 9741 (WhatsApp)</Text>
          </TouchableOpacity>
        </View>

        {/* Support Hours Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            {t('Customer Support Hours')}:
          </Text>
          <Text style={styles.infoText}>
            Monday to Friday: 9:00 AM – 6:00 PM
          </Text>
          <Text style={styles.infoText}>
            Saturday & Sunday: 10:00 AM – 4:00 PM
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpAndContact;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
