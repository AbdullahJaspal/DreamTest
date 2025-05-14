import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import BadgeInfoModal from './BadgeInfoModal';
import {icons} from '../../assets/icons';

interface BadgeRequestModalProps {
  visible: boolean;
  currentBadge?: string;
  onClose: () => void;
  onSubmit: (badgeType: string) => void;
  title?: string;
}

const badges = [
  {
    name: 'Agent',
    description:
      'The Agent Badge is reserved for users officially recognized as agents by the Dream platform. This badge signifies that the user is a verified agent with the authority and responsibilities to represent Dream.',
    functions_and_benefits: [
      {
        title: 'User Support',
        details: 'Agents assist other users with queries.',
      },
      {
        title: 'Account Management',
        details: 'Manage accounts within the platform.',
      },
      {
        title: 'Diamond Verification',
        details: 'Verify genuine diamonds on Dream.',
      },
      {title: 'Gift Supervision', details: 'Oversee the flow of gifts.'},
      {
        title: 'Content Collaboration',
        details: 'Bring influencers to the platform.',
      },
    ],
    how_to_obtain:
      'Granted to selected individuals who meet Dream’s criteria for becoming an agent.',
  },
  {
    name: 'Simple',
    description:
      'The Simple Badge identifies verified accounts of prominent social media personalities.',
    functions_and_benefits: [
      {title: 'Authenticity', details: 'Confirms the account’s legitimacy.'},
      {title: 'Visibility Boost', details: 'Increases account visibility.'},
      {title: 'User Trust', details: 'Ensures followers trust the account.'},
    ],
    how_to_obtain:
      'Awarded to influencers who apply for verification and meet Dream’s standards.',
  },
  {
    name: 'Verified Top 1',
    description:
      'Reserved for global celebrities, renowned artists, and internationally recognized figures.',
    functions_and_benefits: [
      {title: 'Global Recognition', details: 'Signifies top-tier status.'},
      {title: 'Priority Features', details: 'Access to exclusive features.'},
    ],
    how_to_obtain:
      'Awarded to individuals with global influence after meeting platform criteria.',
  },
  {
    name: 'Premium Users',
    description:
      'The Premium Badge is awarded to users who subscribe to the Premium account. This badge signifies access to exclusive features that enhance the user experience on Dream.',
    functions_and_benefits: [
      {
        title: 'Customization',
        details:
          'Unlock features like font color, size, and style customization.',
      },
      {
        title: 'Exclusive Stickers',
        details: 'Access unique stickers to personalize content.',
      },
      {
        title: 'Global Reach',
        details: 'Publish videos visible in all countries worldwide.',
      },
      {
        title: 'Advanced Messaging',
        details:
          'Send private voice and video messages, including encrypted calls.',
      },
      {
        title: 'Data Control',
        details: 'Backup, download, and transfer account data securely.',
      },
    ],
    how_to_obtain:
      'Users can subscribe to one of three Premium Plans:\n\n' +
      '- Basic Plan: 4 features, including font customization and basic stickers.\n' +
      '- Good Plan: 10 features, including advanced stickers and security tools.\n' +
      '- Pro Plan: All 13 features, including encrypted calls and full data management tools.',
  },
  {
    name: 'Business Account',
    description:
      'The Business Badge is given to users who register as business accounts. This badge indicates that the account is a verified business entity capable of leveraging Dream’s platform for commercial purposes.',
    functions_and_benefits: [
      {
        title: 'E-Commerce Capabilities',
        details:
          'Sell unlimited products and manage online storefronts directly through Dream.',
      },
      {
        title: 'Content Monetization',
        details:
          'Monetize video content by renting or selling premium movie and series packages.',
      },
      {
        title: 'Brand Visibility',
        details:
          'Gain access to exclusive tools to promote and grow your business.',
      },
      {
        title: 'Profit Sharing',
        details:
          'Choose between monthly subscription plans or profit-sharing options (70% investor, 30% Dream).',
      },
    ],
    how_to_obtain:
      'This badge is available to users who subscribe to one of the Business Plans:\n\n' +
      '- Starter Plan: $150/month (up to $10,000 in sales).\n' +
      '- Corporate Plan: $350/month (up to $30,000 in sales).\n' +
      '- Enterprise Plan: $650/month (up to $100,000 in sales).',
  },
];

const BadgeRequestModal: React.FC<BadgeRequestModalProps> = ({
  visible,
  currentBadge = '',
  onClose,
  onSubmit,
  title = 'Request a Badge',
}) => {
  const [selectedBadge, setSelectedBadge] =
    React.useState<string>(currentBadge);
  const [badgeInfoVisible, setBadgeInfoVisible] =
    React.useState<boolean>(false);
  const [badgeInfo, setBadgeInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (visible) {
      setSelectedBadge(currentBadge);
    }
  }, [visible, currentBadge]);

  const handleBadgeSelection = (badge: string) => {
    setSelectedBadge(badge);
  };

  const handleRequestSubmit = () => {
    onSubmit(selectedBadge);
  };

  const showBadgeInfo = (badgeName: string) => {
    const info = badges.find(badge => badge.name === badgeName);
    if (info) {
      setBadgeInfo(info);
      setBadgeInfoVisible(true);
    }
  };

  const closeBadgeInfoModal = () => {
    setBadgeInfoVisible(false);
  };

  return (
    <>
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{title}</Text>

            <View style={styles.radioGroup}>
              {[
                'Simple',
                'Verified Top 1',
                'Business Account',
                'Premium Users',
                'Agent',
              ].map(badge => (
                <View key={badge} style={styles.radioOption}>
                  <RadioButton
                    value={badge}
                    status={selectedBadge === badge ? 'checked' : 'unchecked'}
                    onPress={() => handleBadgeSelection(badge)}
                    color="red" // Sets the color to red
                  />
                  <View style={styles.labelContainer}>
                    <Text style={styles.radioLabel}>{badge}</Text>
                    <TouchableOpacity onPress={() => showBadgeInfo(badge)}>
                      <Image
                        source={icons.questionMark}
                        style={styles.questionMarkIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !selectedBadge && styles.disabledButton,
                ]}
                onPress={handleRequestSubmit}
                disabled={!selectedBadge}>
                <Text style={styles.submitButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* BadgeInfoModal */}
      <BadgeInfoModal
        visible={badgeInfoVisible}
        badgeInfo={badgeInfo}
        onClose={closeBadgeInfoModal}
      />
    </>
  );
};

export default BadgeRequestModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  radioGroup: {
    width: '100%',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    // backgroundColor:'green',
    // justifyContent:'space-between'
  },
  // radioLabel: {
  //   fontSize: 14,
  //   marginLeft: 8,
  // },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    // backgroundColor: '#ccc',
    backgroundColor: 'red',

    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red',
    // justifyContent:'space-between'
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 5,
    color: '#333', // Text color
  },
  questionMarkIcon: {
    width: 14,
    height: 14,
    // tintColor: '#888',
    color: '#000',
  },

  modalMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
