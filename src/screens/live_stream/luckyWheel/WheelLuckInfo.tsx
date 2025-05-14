import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');

const AccordionItem = ({question, answer}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.accordionHeader}>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '-' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && <Text style={styles.answerText}>{answer}</Text>}
    </View>
  );
};

const WheelLuckInfo = ({show_model, setShowModel}) => {
  const {t, i18n} = useTranslation();
  const handleClose = () => {
    setShowModel(false);
  };

  const faqData = [
    {
      question: t('What is Lucky Wheel?'),
      answer: t(
        'Lucky Wheel is an exciting lottery-style feature in the Dream app that allows users to win amazing rewards through a Lucky Wheel. Users can participate by purchasing tickets made up of 12 numbers, giving them a chance to win based on how many numbers match the drawn results.',
      ),
    },
    {
      question: t('How Can I Get Tickets?'),
      answer: `${t(
        'You can obtain tickets for Lucky Wheel through the following ways',
      )}:\n\n${t('Purchasing Tickets')}:\n- ${t(
        'Buy a ticket with 12 numbers using 1000 diamonds (equivalent to $0.80 USD)',
      )}.\n- {${t(
        'Purchased tickets are added to your wallet under the Lucky Wheel section',
      )}}.\n\n{${t('Premium and Business Accounts')}}:\n- ${t(
        'Premium Account: Receive 3 free tickets every month',
      )}.\n- ${t('Business Account')}: ${t(
        'Receive 7 free tickets every month',
      )}.\n\n${t('Earn Diamonds to Buy Tickets')}:\n- ${t(
        'Receive diamonds from gifts sent by fans who like your videos',
      )}.\n- ${t(
        'Collect diamonds from treasure boxes placed on videos to boost engagement',
      )}.\n- ${t(
        'Get diamonds from Dream management by actively using the app through likes, shares, comments, and sharing videos outside the app',
      )}.\n- ${t(
        'Earn diamonds by ranking in the Top 3 in categories (Hourly, Daily, Weekly, or Monthly) based on gift points earned through your content',
      )}.`,
    },
    {
      question: t('How Does the Lucky Draw Work?'),
      answer: t(
        'Purchase or receive tickets, each containing 12 numbers. The tickets are stored in the Lucky Wheel section of your wallet. At the end of each month, a live event will be hosted, featuring a Lucky Wheel. Numbers will be drawn randomly, and winners will be announced based on the number of matching numbers.',
      ),
    },
    {
      question: t('What Are the Winning Rules?'),
      answer: `${t(
        'Winners are selected based on the number of matching numbers in their tickets',
      )}:\n-${t('6 Matching Numbers: Small prize')}.\n- ${t(
        '9 Matching Numbers: Medium prize',
      )}.\n- ${t('12 Matching Numbers: Grand prize')}.\n\n ${t(
        'The exact prize values and details will be shared before each draw through notifications from Dream.',
      )}`,
    },
    {
      question: t('How Can I Watch the Live Draw?'),
      answer: t(
        "Dream will notify all users via an in-app message about the date, time, and platform for the live draw event each month. Stay tuned to your notifications to ensure you don't miss it!",
      ),
    },
    {
      question: t('Why Should I Participate?'),
      answer: `- ${t(
        'Exciting Rewards: Win prizes based on your luck and ticket matches',
      )}.\n- ${t(
        'Engagement Bonuses: Earn more diamonds through interactions, boosting your chances',
      )}.\n- ${t(
        'Recognition: Rank higher by engaging followers and increasing views',
      )}.\n- ${t(
        'Free Tickets for Premium and Business Users: More chances to win every month.',
      )}`,
    },
    {
      question: t('How Can I Track My Tickets and Wins?'),
      answer: t(
        'Go to your wallet and select the Lucky Wheel section to view your tickets. Check updates about winning numbers and rewards through notifications and the results section in the app.',
      ),
    },
    {
      question: t('Need More Help?'),
      answer: `${t(
        'For additional support, you can visit the Help Center in the Dream app or contact our Support Team directly',
      )}.\n\n ${t(
        'Good Luck, and may your dreams come true with Lucky Wheel',
      )}!`,
    },
  ];

  return (
    <Modal
      visible={show_model}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      {/* Modal backdrop */}
      <Pressable onPress={handleClose} style={styles.modalOverlay} />

      <View style={styles.mainContainer}>
        <Text style={styles.title}>{t('Frequently Asked Questions')}</Text>
        <ScrollView>
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default React.memo(WheelLuckInfo);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  mainContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 50,
  },
  accordionItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingVertical: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    lineHeight: 20,
  },
});
