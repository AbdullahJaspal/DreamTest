import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {icons} from '../../assets/icons';

const {height, width} = Dimensions.get('window');

interface BadgeInfoModalProps {
  visible: boolean;
  badgeInfo: any;
  onClose: () => void;
}

const BadgeInfoDoc = ({title, content}: {title: string; content: string}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '-' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && <Text style={styles.accordionContent}>{content}</Text>}
    </View>
  );
};

const BadgeInfoModal: React.FC<BadgeInfoModalProps> = ({
  visible,
  badgeInfo,
  onClose,
}) => {
  if (!badgeInfo) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable onPress={onClose} style={styles.modalOverlay} />

      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Badge Information</Text>
          <TouchableOpacity onPress={onClose}>
            {/* <Text style={styles.closeButtonText}>X</Text> */}
            <Image source={icons.close} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.infoTitle}>{badgeInfo.name}</Text>
          <Text style={styles.description}>{badgeInfo.description}</Text>
          <BadgeInfoDoc
            title="Functions and Benefits"
            content={badgeInfo.functions_and_benefits.map(
              (item: any, index: number) => (
                <View key={index}>
                  <Text style={styles.functionTitle}>{item.title}</Text>
                  <Text style={styles.functionDetails}>{item.details}</Text>
                </View>
              ),
            )}
          />
          <BadgeInfoDoc
            title="How to Obtain"
            content={badgeInfo.how_to_obtain}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default BadgeInfoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height, // Full-screen modal
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  content: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 15,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expandIcon: {
    fontSize: 18,
    color: '#666',
  },
  accordionContent: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  functionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  functionDetails: {
    fontSize: 14,
    color: '#666',
  },
});
