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

const {width, height} = Dimensions.get('window');

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionItemProps {
  question: string;
  answer: string;
}

interface InfoModalProps {
  show_model: boolean;
  setShowModel: (value: boolean) => void;
  faqData: FAQItem[];
  title?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({question, answer}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.accordionHeader}
        accessible={true}
        accessibilityLabel={`Toggle ${question}`}>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '-' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && <Text style={styles.answerText}>{answer}</Text>}
    </View>
  );
};

const InfoModal: React.FC<InfoModalProps> = ({
  show_model,
  setShowModel,
  faqData,
  title = 'Frequently Asked Questions',
}) => {
  const handleClose = () => {
    setShowModel(false);
  };

  return (
    <Modal
      visible={show_model}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}>
      {/* Modal backdrop */}
      <Pressable onPress={handleClose} style={styles.modalOverlay} />

      <View style={styles.mainContainer}>
        <Text style={styles.title}>{title}</Text>
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

export default React.memo(InfoModal);

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
