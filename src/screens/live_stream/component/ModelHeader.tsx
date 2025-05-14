import React, {useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import InfoModal from '../../../components/infoButtonModal';
const {width} = Dimensions.get('screen');

const faqData = [
  {
    question: 'How can I add a sound to my video before publishing?',
    answer:
      'When you are ready to publish a video, tap on the "Sounds" button. From there, you can browse and select a sound to add to your video. Once you choose a sound, it will replace the original audio of your video.',
  },
  {
    question:
      'What happens to the original sound of my video when I add a new sound?',
    answer:
      'When you add a new sound, the original audio of your video will be removed and replaced with the selected sound. Make sure to preview the video before publishing to ensure it sounds the way you want.',
  },
  {
    question: 'Can I adjust the volume of the added sound?',
    answer:
      'Yes! After selecting a sound, you can adjust its volume to match your video’s content. This allows you to control how loud or soft the added sound will be.',
  },
  {
    question: 'Can I change the sound after selecting it?',
    answer:
      'Yes, you can change the sound at any time before publishing. Just go back to the "Sounds" section, select a different sound, and it will replace the previous one.',
  },
];

interface ModelHeaderProps {
  headerText?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIconPress?: () => void;
  rightIconPress?: () => void;
}
const ModelHeader: React.FC<ModelHeaderProps> = ({
  headerText = 'Header',
  showLeftIcon = false,
  showRightIcon = false,
  leftIconPress = () => {},
  rightIconPress = () => {},
}) => {
  const [showInfo, setShowInfo] = useState(false); // State for modal visibility

  return (
    <View style={styles.main_container}>
      {showLeftIcon && (
        <Pressable
          style={styles.side_button}
          onPress={leftIconPress}
          accessibilityLabel="Left icon button">
          <Entypo name="chevron-small-left" size={30} color={'#020202'} />
        </Pressable>
      )}

      <View>
        <Text style={styles.header_text}>{headerText}</Text>
      </View>

      {showRightIcon && (
        <Pressable
          style={styles.side_button}
          // onPress={rightIconPress}
          onPress={() => setShowInfo(true)} // Show modal on click
          accessibilityLabel="Right icon button">
          <SimpleLineIcons name="question" size={23} color={'#020202'} />
        </Pressable>
      )}

      {/* Info Modal */}
      <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        faqData={faqData}
        title="Sound Info"
      />
    </View>
  );
};

export default ModelHeader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: 'rgba(0, 0, 0, 0.6)',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  header_text: {
    fontSize: 20,
    color: '#020202',
    fontWeight: '600',
  },
  side_button: {
    width: 25,
  },
});
