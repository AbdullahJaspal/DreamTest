import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import CInput from '../../../../components/CInput';
import {icons} from '../../../../assets/icons';

const {width} = Dimensions.get('window');

// Accordion item component
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

//GeneralChange

const Question_answer = () => {
  const faqData = [
    {
      topic: 'Customer Service Questions & Answers',
      questions: [
        {
          question: 'Where Are Diamond Purchases Available?',
          answer: `Currently, purchasing diamonds is only available in selected countries and regions. Additionally, users must meet the minimum age requirement:
        - 18 years old in most countries.
        - 19 years old in Korea.
        Dream does not support third-party payment services. All purchases should be made directly through the official Dream App or website.`,
        },
        {
          question: 'I Didn’t Receive My Diamonds After Payment',
          answer: `If you do not see the purchased diamonds in your wallet after a successful transaction:
        1. Restart the app and refresh the Wallet page.
        2. If the issue persists, send a screenshot of your Google Play or App Store purchase receipt.
        Note:
        - You can find the receipt in the confirmation email sent by Google Play or App Store.
        - Ensure the screenshot includes:
          - Order ID
          - Transaction amount
          - Payment time
        Tap "Need more help?" to submit your issue to our support team.`,
        },
        {
          question: 'Why Wasn’t My Payment Processed?',
          answer: `If you meet the requirements to purchase diamonds but the payment cannot be completed, please confirm the following:
        - You have a valid payment method linked to your Google Play or App Store account.
        - You are not using a VPN to access the app.
        - Your Dream app is updated to the latest version.
        - You have a stable internet connection.
        For further assistance:
        - Visit the App Store Support: Apple Support.
        - Visit Google Play Support: Google Play Help.
        If the issue persists, tap "Need more help?" to contact our support team.`,
        },
        {
          question: 'What is Lucky Wheel?',
          answer: `Lucky Wheel is an exciting lottery-style feature in the Dream app that allows users to win amazing rewards through a Lucky Spin Wheel. Users can participate by purchasing tickets made up of 12 numbers, giving them a chance to win based on how many numbers match the drawn results.`,
        },
        {
          question: 'How Can I Get Tickets?',
          answer: `You can obtain tickets for Lucky Wheel through the following ways:
        - Purchasing Tickets:
          - Buy a ticket with 12 numbers using 1000 diamonds (equivalent to $0.80 USD).
          - Purchased tickets are added to your wallet under the Lucky Wheel section.
        - Premium and Business Accounts:
          - Premium Account: Receive 3 free tickets every month.
          - Business Account: Receive 7 free tickets every month.
        - Earn Diamonds to Buy Tickets:
          - Receive diamonds from gifts sent by fans who like your videos.
          - Collect diamonds from treasure boxes placed on videos to boost engagement.
          - Get diamonds from Dream management by actively using the app:
            - Likes, shares, and comments on videos.
            - Sharing videos outside the app to friends or social media.
          - Earn diamonds by ranking in the Top 3 in categories (Hourly, Daily, Weekly, or Monthly) based on gift points earned through your content.`,
        },
        {
          question: 'How Does the Lucky Draw Work?',
          answer: `Purchase or receive tickets, each containing 12 numbers.
        
        - The tickets are stored in the Lucky Well section of your wallet.
        - At the end of each month, a live event will be hosted, featuring a Lucky Spin Wheel.
        - Numbers will be drawn randomly, and winners will be announced based on the number of matching numbers.`,
        },
        {
          question: 'What Are the Winning Rules?',
          answer: `Winners are selected based on the number of matching numbers in their tickets:
        
        - 6 Matching Numbers: Small prize.
        - 9 Matching Numbers: Medium prize.
        - 12 Matching Numbers: Grand prize.
        
        The exact prize values and details will be shared before each draw through notifications from Dream.`,
        },
        {
          question: 'How Can I Watch the Live Draw?',
          answer: `Dream will notify all users via an in-app message about the date, time, and platform for the live draw event each month. Stay tuned to your notifications to ensure you don't miss it!`,
        },
        {
          question: 'Why Should I Participate?',
          answer: `- Exciting Rewards: Win prizes based on your luck and ticket matches.
        - Engagement Bonuses: Earn more diamonds through interactions, boosting your chances.
        - Recognition: Rank higher by engaging followers and increasing views.
        - Free Tickets for Premium and Business Users: More chances to win every month.`,
        },
        {
          question: 'How Can I Track My Tickets and Wins?',
          answer: `- Go to your wallet and select the Lucky Well section to view your tickets.
        - Check updates about winning numbers and rewards through notifications and the results section in the app.`,
        },
        {
          question: 'What is the Gift Box Feature?',
          answer: `The Gift Box is a unique feature in Dream that allows content creators and users to promote videos, increase engagement, and reward fans with diamonds. Users can place Gift Boxes on their own videos or any video they wish to support, offering fans a chance to earn diamonds by completing specific tasks.`,
        },
        {
          question: 'How to Use the Gift Box Feature?',
          answer: `1. Setting Up a Gift Box:
        - Go to the Gift Box Section in the video’s gift options.
        - Choose the video you want to attach the Gift Box to (your own video or a friend's video).

        Customize your Gift Box:
        - Set Diamond Amount: Decide how many diamonds to include in the Gift Box.
        - Set Time and Date: Choose when the Gift Box will be available.
        - Set Participant Limit: Decide how many users can claim diamonds (manual or automatic settings available).

        Once set, the Gift Box is ready to engage users!

        2. Claiming Diamonds from a Gift Box:
        - Follow the Video Creator and Gift Box Owner.
        - Share the Video: Share the video outside the app (e.g., WhatsApp, Instagram, Facebook, Twitter, etc.).
        - Like the Video.
        - Write a Unique Comment: Add a positive, non-duplicate comment to the video.

        Important Rules:
        - Users must complete all four tasks to receive diamonds from the Gift Box.
        - If any task is undone after receiving diamonds, the diamonds will be returned to the Gift Box owner’s wallet.`,
        },
        {
          question: 'How do I send Gifts to users?',
          answer: `To send a GIFT, visit the user’s profile or video, tap on the GIFT icon, and choose a virtual gift to send. Gifts can be purchased using coins.`,
        },
        {
          question: 'How can I Withdraw Profits?',
          answer: `If you earn coins or money in the app, you can withdraw them via the "Withdraw" section under "Settings." Choose your payment method, enter the amount, and confirm.`,
        },
        {
          question: 'How do I Block and Report Users?',
          answer: `To block or report a user, go to their profile, click the "Options" menu, and select "Block" or "Report." Follow the prompts to complete the action.`,
        },
        {
          question: 'How is Security of Accounts ensured?',
          answer: `The app uses two-factor authentication, password encryption, and activity monitoring to secure accounts. Users can enable extra security options in "Account Settings."`,
        },
        {
          question: 'What is Backup Accounts?',
          answer: `Backup Accounts allows users to save their data and account details securely. You can enable this feature in "Settings" to ensure your information is recoverable.`,
        },
        {
          question: 'How do I Publish a Video?',
          answer: `Tap the "Upload" button, choose a video from your gallery, add a caption, hashtags, and click "Publish." Videos are immediately visible in the feed.`,
        },
        {
          question: 'How do I use Sounds in videos?',
          answer: `Select "Add Sound" while uploading a video, choose from the app's sound library, and sync it with your video.`,
        },
        {
          question: 'What is Ranking, and how does it work?',
          answer: `Rankings display the top users based on engagement, such as likes, comments, or gifts received. Check your position in the "Leaderboard" section.`,
        },
        {
          question: 'What does Charge Coins mean?',
          answer: `This feature allows users to purchase coins for gifts or promotions. Visit the "Coins" section in settings to recharge.`,
        },
        {
          question: 'How do I Comment on Videos?',
          answer: `Click on a video, tap the comment section, type your message, and press "Send."`,
        },
        {
          question: 'How can I Send Balance to a Friend?',
          answer: `Visit the "Transfer" section, enter your friend’s username, select the amount, and confirm the transaction.`,
        },
        {
          question: 'What is Analytics?',
          answer: `Analytics provide users with detailed stats about their posts, such as views, likes, and engagement rates. Premium users can see deeper insights.`,
        },
        {
          question: 'What Payment Methods are Supported?',
          answer: `Supported payment methods include credit cards, PayPal, and local options. You can configure payment in the "Settings."`,
        },
        {
          question: 'What is Download Information?',
          answer: `This feature allows users to download their activity data and personal information for record-keeping.`,
        },
        {
          question: 'How does QR Code work?',
          answer: `The QR Code feature lets you generate a unique code for others to scan and follow your profile.`,
        },
        {
          question: 'What is Ads Promote?',
          answer: `Use this feature to promote your content by paying coins. Ads will appear on other users' feeds.`,
        },
        {
          question: 'What is Avatar?',
          answer: `Customize your profile avatar by uploading an image or choosing one from the app’s default library.`,
        },
        {
          question: 'How do I Change My Password?',
          answer: `Go to "Account Settings," select "Change Password," enter your old password, and set a new one.`,
        },
        {
          question: 'Can I Delete a Comment on My Video?',
          answer: `Yes, tap on the comment, select "Delete," and confirm.`,
        },
        {
          question: 'How do I Delete a Comment on the Feed?',
          answer: `Open the comment, click the "Options" button, and select "Delete."`,
        },
        {
          question: 'Can I Delete My Videos?',
          answer: `Yes, visit your profile, click the video, and select "Delete."`,
        },
        {
          question: 'How can I Add Social Media Accounts?',
          answer: `In "Settings," link your social media accounts for cross-platform sharing.`,
        },
        {
          question: 'How do I Save Videos?',
          answer: `Open a video, click the "Save" icon, and it will be stored in your gallery.`,
        },
        {
          question: 'Can I Transfer My Information to Another Account?',
          answer: `Yes, visit "Settings," select "Transfer Info," and follow the steps to link your data to another account.`,
        },
        {
          question: 'How do I Switch Accounts?',
          answer:
            'Use the "Switch Account" option under "Profile" to log in to another account without logging out.',
        },
        {
          question: 'How do I Delete My Account?',
          answer:
            'Visit "Settings," click "Delete Account," and follow the confirmation steps.',
        },
        {
          question: 'What is Use Hashtag?',
          answer:
            'Hashtags help categorize content. Add them to your posts to increase visibility.',
        },
        {
          question: 'How to Use the Audio Features in Dream',
          answer: `1. Upload Your Own Audio:
        - Open the video editor in the Dream app.
        - Tap the "Add Audio" button.
        - Select "Upload Audio" to choose a sound file from your device.
        - Adjust the audio to fit your video as needed.
        Tip: Ensure your audio complies with community guidelines and copyright rules.
        
        2. Change the Video's Original Sound:
        - While editing a video, tap the "Audio" option.
        - Select "Replace Original Sound" to mute the existing sound.
        - Choose from:
          - Music Library: Access Dream’s collection of sounds and tracks.
          - Voice Effects: Add fun voice modifications to your audio.

        3. Adjust Audio Settings:
        - After adding or replacing audio, you can:
          - Trim the Audio: Match the sound to specific parts of your video.
          - Adjust Volume: Balance the video’s original sound with the new audio.
          - Add Fade Effects: Create smooth transitions for a professional touch.

        4. Save and Share:
        - Once your audio is set, save your edits and share your video to your profile or with friends!
        For further assistance, please contact Customer Support through the app.`,
        },
        {
          question: 'What is Trending Content?',
          answer:
            'The Trending section displays popular posts based on views and engagement.',
        },
        {
          question: 'What is Premium?',
          answer:
            'Premium gives access to exclusive features like:\n- Changing text size and color.\n- Adding special stickers.\n- Posting videos in multiple countries.\n- Sending global private messages.\n- Ad-free browsing.\n- Uploading videos longer than 15 minutes.',
        },
        {
          question: 'How do I Subscribe to Premium?',
          answer:
            "Go to 'Settings,' click 'Premium,' and choose a subscription plan.",
        },
        {
          question: 'What is Business Account?',
          answer:
            'This upcoming feature will allow users to:\n- Promote their products.\n- Sell items without limits.\n- Rent or sell movie/series packages.',
        },
        {
          question: 'When Will the Business Account Be Available?',
          answer: 'This feature will launch soon; keep an eye on updates.',
        },
      ],
    },
    // {
    //   topic: 'Lucky Wheel',
    //   questions: [
    //     {
    //       question: 'What is Lucky Wheel?',
    //       answer: `Lucky Wheel is an exciting lottery-style feature in the Dream app that allows users to win amazing rewards through a Lucky Spin Wheel. Users can participate by purchasing tickets made up of 12 numbers, giving them a chance to win based on how many numbers match the drawn results.`,
    //     },
    //     {
    //       question: 'How Can I Get Tickets?',
    //       answer: `You can obtain tickets for Lucky Wheel through the following ways:
    //     - Purchasing Tickets:
    //       - Buy a ticket with 12 numbers using 1000 diamonds (equivalent to $0.80 USD).
    //       - Purchased tickets are added to your wallet under the Lucky Wheel section.
    //     - Premium and Business Accounts:
    //       - Premium Account: Receive 3 free tickets every month.
    //       - Business Account: Receive 7 free tickets every month.
    //     - Earn Diamonds to Buy Tickets:
    //       - Receive diamonds from gifts sent by fans who like your videos.
    //       - Collect diamonds from treasure boxes placed on videos to boost engagement.
    //       - Get diamonds from Dream management by actively using the app:
    //         - Likes, shares, and comments on videos.
    //         - Sharing videos outside the app to friends or social media.
    //       - Earn diamonds by ranking in the Top 3 in categories (Hourly, Daily, Weekly, or Monthly) based on gift points earned through your content.`,
    //     },

    //   ],
    // },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(faqData);
  const [isFocus, setIsFocus] = useState(false); // Focus state for search

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(faqData);
    } else {
      const newFilteredData = faqData
        .map(topic => ({
          ...topic,
          questions: topic.questions.filter(q =>
            q.question.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter(topic => topic.questions.length > 0);
      setFilteredData(newFilteredData);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <View style={styles.searchBar}>
        <Animated.View style={styles.searchInput}>
          <CInput
            onFocus={() => setIsFocus(true)}
            iconLeft={icons.search} // Update with correct path
            placeholder={'Search'}
            value={searchQuery}
            iconColor={'#000000'}
            onChangeText={handleSearch}
            returnKeyType={'search'}
          />
        </Animated.View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {filteredData?.length > 0 ? (
          filteredData.map((topic, index) => (
            <View key={index}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              {topic.questions.map((item, qIndex) => (
                <AccordionItem
                  key={qIndex}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.content}>
            <Text style={styles.message}>No questions found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Question_answer;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  searchBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flexGrow: 1,
    borderRadius: 24,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  message: {
    fontSize: 16,
    color: '#666',
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
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: width * 0.85,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
});
