import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {icons} from '../../assets/icons';
import {useAppSelector} from '../../store/hooks';
import InfoModal from '../../components/infoButtonModal';
import {selectMyProfileData} from '../../store/selectors';

const {width} = Dimensions.get('screen');

const RenderRechargeSheetHeader = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const [showInfo, setShowInfo] = useState(false);

  const faqData = [
    {
      question: 'How to Recharge Diamonds in Dream?',
      answer: `
1. Recharge Through Your Wallet:
   - Open the Dream App and go to the Wallet section from your profile.
   - Tap on “Recharge Diamonds” and browse the available diamond packages.
   - Select your preferred package and complete the transaction using your linked payment method.

2. Recharge While Sending Gifts:
   - Tap on the Gift Icon while watching a video.
   - If you don’t have enough diamonds, select “Recharge Diamonds” at the bottom of the screen.
   - Choose a diamond package and follow the payment process.

**Important Note:**
All purchases must be completed through the payment methods linked to your Google Play or App Store account. Make sure your payment method is valid and up to date for a smooth experience.
        `,
    },
    {
      question: 'Why Is My Recharge Restricted?',
      answer: `
To ensure account security, Dream temporarily disables recharges if unusual activity or suspicious transactions are detected. For assistance in resolving this issue, reach out to Customer Support through the app.
        `,
    },
    {
      question: 'Where Are Diamond Purchases Available?',
      answer: `
Currently, purchasing diamonds is only available in selected countries and regions. Additionally, users must meet the minimum age requirement:

- 18 years old in most countries.
- 19 years old in Korea.

Dream does not support third-party payment services. All purchases should be made directly through the official Dream App or website.
        `,
    },
    {
      question: 'What to Do If Payment Fails?',
      answer: `
If your payment cannot be processed, try the following steps:

1. Ensure your payment method is correctly linked to your Google Play or App Store account.
2. Avoid using a VPN during the transaction process.
3. Update your Dream App to the latest version.
4. Check your internet connection to ensure it is stable.

For persistent issues, visit the following support pages for additional help:
- Google Play Help Center
- Apple Support

Alternatively, report the issue directly through the Help Center in the Dream App.
        `,
    },
    {
      question: 'What If I Didn’t Receive My Diamonds?',
      answer: `
If you’ve successfully completed a payment but the diamonds aren’t appearing in your wallet:

1. Restart the Dream App and refresh the Wallet section.
2. Check your purchase receipt in the confirmation email sent by Google Play or App Store.
3. If the issue persists, take a screenshot of the receipt showing:
   - Order ID
   - Transaction Amount
   - Payment Time

Submit the screenshot via the Help Center in the Dream App for a quick resolution.
        `,
    },
    {
      question: 'Need Further Assistance?',
      answer: `
If you’re experiencing issues or have more questions about diamond purchases, reach out to Dream Customer Support through the Help Center in the app. We’re here to help!
        `,
    },
  ];

  return (
    <>
      <View style={styles.upper_container}>
        <Text style={styles.recharge_text}>Recharge</Text>

        <Pressable
          style={styles.question_mark_view}
          onPress={() => setShowInfo(true)}>
          <Image source={icons.questionMark} style={{width: 20, height: 20}} />
        </Pressable>
      </View>

      <View style={styles.balance_view}>
        <Text>Balance</Text>
        <Image source={icons.diamond} style={styles.diamonds_img} />
        <Text>{my_data?.wallet}</Text>
      </View>
      <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        faqData={faqData}
        title="Recharge Method Info"
      />
    </>
  );
};

export default RenderRechargeSheetHeader;

const styles = StyleSheet.create({
  upper_container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    padding: 15,
    flexDirection: 'row',
  },
  recharge_text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  question_mark_view: {
    position: 'absolute',
    right: 15,
  },
  balance_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  diamonds_img: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginRight: 3,
  },
});
