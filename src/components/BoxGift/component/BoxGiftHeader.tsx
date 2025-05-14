import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InfoModal from '../../infoButtonModal';
import {icons} from '../../../assets/icons';
const {width} = Dimensions.get('screen');

interface BoxGiftHeaderProps {
  selected_container: string;
  setSelected_container: any;
  handleClose: any;
}

const BoxGiftHeader: React.FC<BoxGiftHeaderProps> = ({
  selected_container,
  setSelected_container,
  handleClose,
}) => {
  const [showInfo, setShowInfo] = useState(false); //SHOW INFO MODAL
  const faqData = [
    {
      question: 'What is the Gift Box Feature?',
      answer:
        'The Gift Box is a unique feature in Dream that allows content creators and users to promote videos, increase engagement, and reward fans with diamonds. Users can place Gift Boxes on their own videos or any video they wish to support, offering fans a chance to earn diamonds by completing specific tasks.',
    },
    {
      question: 'How to Use the Gift Box Feature?',
      answer: `
1.⁠ ⁠**Setting Up a Gift Box**:
   - Go to the Gift Box Section in the video’s gift options.
   - Choose the video you want to attach the Gift Box to (your own video or a friend's video).
   - **Customize your Gift Box**:
     - **Set Diamond Amount**: Decide how many diamonds to include in the Gift Box.
     - **Set Time and Date**: Choose when the Gift Box will be available.
     - **Set Participant Limit**: Decide how many users can claim diamonds (manual or automatic settings available).
   - Once set, the Gift Box is ready to engage users!

2.⁠ ⁠**Claiming Diamonds from a Gift Box**:
   - To claim diamonds, users must complete four tasks within 3 minutes after the Gift Box opens:
     - **Follow the Video Creator and Gift Box Owner**: Gain new followers and support creators.
     - **Share the Video**: Share the video outside the app (e.g., WhatsApp, Instagram, Facebook, Twitter, etc.).
     - **Like the Video**: Express appreciation by giving a like.
     - **Write a Unique Comment**: Add a positive, non-duplicate comment to the video. (Copy-paste comments are not allowed and can affect your account verification.)`,
    },
    {
      question: 'Important Rules',
      answer: `
- Users must complete all four tasks to receive diamonds from the Gift Box.
- If any task is undone after receiving diamonds (e.g., unfollowing, deleting comments, or unliking), the diamonds will automatically be returned to the Gift Box owner’s wallet.`,
    },
    {
      question: 'Benefits of the Gift Box Feature',
      answer: `
**For Content Creators**:
- **Boost Engagement**: Increase interactions such as likes, comments, and shares on videos.
- **Gain Followers**: Attract new fans to your profile.

**For Gift Box Buyers**:
- **Support Content**: Show appreciation for creators by promoting their videos.
- **Strengthen Connections**: Help your friends or creators reach a wider audience.

**For Task Performers**:
- **Earn Diamonds**: Complete tasks and receive diamonds as rewards for your efforts.`,
    },
    {
      question: 'For additional information or assistance',
      answer: 'Please contact Customer Support.',
    },
  ];

  return (
    <View style={styles.main_container}>
      {/* Question mark view */}
      <Pressable onPress={() => setShowInfo(true)}>
        <Image source={icons.questionMark} style={styles.icon_view} />
      </Pressable>

      {/* Middle container, switching between tab */}
      <View style={styles.middle_container}>
        <Pressable
          onPress={() => {
            setSelected_container('custom');
          }}
          style={[
            styles.tab_view,
            {
              borderBottomWidth: selected_container === 'custom' ? 2 : 0,
            },
          ]}>
          <Text style={styles.tab_text}>Custom</Text>
          <Ionicons name="pencil" size={20} color={'#000'} />
        </Pressable>

        <Pressable
          onPress={() => {
            setSelected_container('put_box');
          }}
          style={[
            styles.tab_view,
            {
              borderBottomWidth: selected_container === 'put_box' ? 2 : 0,
            },
          ]}>
          <Text style={styles.tab_text}>Put Gift</Text>
          <Image source={icons.boxGift} style={styles.icon_view} />
        </Pressable>
      </View>

      {/* Close button container */}
      <TouchableOpacity onPress={handleClose}>
        <Image source={icons.close} style={styles.icon_view} />
      </TouchableOpacity>
      <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        faqData={faqData}
        title="Purchasing Gift Info"
      />
    </View>
  );
};

export default BoxGiftHeader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 0.3,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  icon_view: {
    width: 20,
    height: 20,
  },
  middle_container: {
    flexDirection: 'row',
    width: width * 0.55,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  tab_text: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '900',
    marginRight: 5,
  },
});
