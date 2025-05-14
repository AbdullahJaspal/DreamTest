import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import {Slider} from '@miblanchard/react-native-slider';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Icon, CButton} from '../../components/index';
import {setRechargeSheet} from '../../store/slices/ui/indexSlice';
import {truncateText} from '../../utils/truncateText';
import {icons} from '../../assets/icons';
import {gifs} from '../../assets/gifs';

const {width, height} = Dimensions.get('window');

const Promotion = ({setPromotion}) => {
  const {t, i18n} = useTranslation();

  const [audience, setAudience] = useState(true);
  const [budget, setBuget] = useState(1);
  const [promotion_time, setPromotion_time] = useState(1);
  const [promotion_way, setPromotion_way] = useState('real time screen');
  const my_data = useAppSelector(selectMyProfileData);
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  let totalBudget = budget * promotion_time;
  const [final_budget, setFinal_budget] = useState(budget * promotion_time);

  const max_reach = (200 * totalBudget) / 5;
  const min_reach = (500 * totalBudget) / 5;

  const min_like = (20 * totalBudget) / 5;
  const max_like = (30 * totalBudget) / 5;

  const min_followers = (2 * totalBudget) / 5;
  const max_folowers = (3 * totalBudget) / 5;

  const min_profile_visit = (10 * totalBudget) / 5;
  const max_profiel_visit = (20 * totalBudget) / 5;

  const min_comment = (0.75 * totalBudget) / 5;
  const max_comment = (2 * totalBudget) / 5;

  const [followers, setFollowers] = useState(
    (min_followers + max_folowers) / 2,
  );
  const [profile_visit, setProfile_visit] = useState(
    (min_profile_visit + max_profiel_visit) / 2,
  );
  const [like, setlike] = useState((min_like + max_like) / 2);
  const [comment, setComment] = useState((min_comment + max_comment) / 2);

  const handleFollowersChange = value => {
    setFollowers(value[0]);
    const averageFollowers = Math.round(
      Math.abs((min_followers + max_folowers) / 2),
    );
    if (value > averageFollowers) {
      const extraFollowers = value - averageFollowers;
      const extraPrice = extraFollowers / 20;
      setFinal_budget(budget * promotion_time + Math.round(extraPrice));
    } else {
      const extraFollowers = averageFollowers - value;
      const extraPrice = extraFollowers / 20;
      setFinal_budget(budget * promotion_time - Math.round(extraPrice));
    }
  };

  const handleProfileVisitChange = value => {
    setProfile_visit(value[0]);
    const averageProfileVisit = Math.round(
      Math.abs((min_profile_visit + max_profiel_visit) / 2),
    );
    if (value > averageProfileVisit) {
      const extraProfileVisit = value - averageProfileVisit;
      const extraPrice = extraProfileVisit / 15;
      setFinal_budget(p => p + extraPrice);
    } else {
      const extraProfileVisit = averageProfileVisit - value;
      const extraPrice = extraProfileVisit / 15;
      setFinal_budget(p => p - extraPrice);
    }
  };

  const handleLikeChange = value => {
    setlike(value[0]);
    const averageLike = Math.round(Math.abs((min_like + max_like) / 2));
    if (value > averageLike) {
      const extraLike = value - averageLike;
      const extraPrice = extraLike / 250;
      setFinal_budget(p => p + Math.round(extraPrice));
    } else {
      const extraLike = averageLike - value;
      const extraPrice = extraLike / 250;
      setFinal_budget(p => p - Math.round(extraPrice));
    }
  };

  const handleCommentChange = value => {
    setComment(value[0]);
    const averageComment = Math.round(
      Math.abs((min_comment + max_comment) / 2),
    );
    if (value > averageComment) {
      const extraComment = value - averageComment;
      const extraPrice = extraComment / 2;
      setFinal_budget(p => p + extraPrice);
    } else {
      const extraComment = averageComment - value;
      const extraPrice = extraComment / 2;
      setFinal_budget(p => p - extraPrice);
    }
  };

  const handleBudgetChange = value => {
    setBuget(value);
    setFinal_budget(value * promotion_time);
  };
  const handlePromotionChange = value => {
    setPromotion_time(value);
    setFinal_budget(value * budget);
  };

  const Pressing_cut_button = () => {
    console.log('pressed');
    setPromotion(false);
  };

  const makePayments = () => {
    if (my_data?.wallet >= promotion_time * budget * 120) {
      console.log('do payments');
    } else {
      dispatch(setRechargeSheet(true));
    }
  };

  return (
    <View style={styles.container}>
      {/* upper part */}
      <View style={styles.upper_section}>
        {/* icon container  */}

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.icon_containers}>
          <Icon source={icons.close} tintColor={'white'} />
        </TouchableOpacity>
        {/* picture and title section */}
        <View style={styles.picture_and_title_section}>
          <Icon
            source={
              my_data?.profile_pic
                ? {uri: my_data?.profile_pic}
                : icons.userFilled
            }
            style={styles.img}
          />
          <Icon
            source={icons.crown}
            style={{
              position: 'absolute',
              width: 85,
              height: 85,
              left: -70,
              top: -15,
            }}
          />

          <TextInput
            placeholder={t('Add a title')}
            placeholderTextColor={'rgba(255, 255, 255, 1)'}
            style={styles.input}
            multiline={true}
          />
        </View>

        {/* topic and adding live gift section */}
        <View style={styles.topic_and_live_adding}>
          <TouchableOpacity>
            <Text style={styles.txt}>{t('Add topic')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.live_adding}>
            <Image source={gifs.live} style={{width: 20, height: 20}} />
            <Text style={styles.txt}>{t('Add a LIVE g')}.....</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* upper section completed */}

      {/* bottom section start */}
      {/* promote section with two icons */}
      <View style={styles.bottom_section_header}>
        <View style={styles.promote_with_two_icon}>
          <Image source={icons.back} />
          <Text style={styles.promote_text}>Promote</Text>
          <Image source={icons.questionMark} />
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={{width: width, alignItems: 'center'}}>
          {/* choose way to promote */}
          <View style={styles.way_to_promote}>
            <View style={styles.way_of_pomotions_view}>
              <Text style={[styles.txt, {color: 'rgba(0, 0, 0, 1)'}]}>
                {t('Choose Way to promote')}
              </Text>
              <Icon
                source={icons.back}
                style={{transform: [{rotate: '180deg'}], width: 14, height: 14}}
              />
            </View>

            <View style={styles.dream_app_choose_for_you}>
              <View style={styles.way_of_pomotions_view}>
                <Image
                  source={icons.graph}
                  tintColor={'black'}
                  style={{marginRight: 6}}
                />
                <Text>{t('Promote LIVE')} </Text>
              </View>
              <RadioButton
                status={
                  promotion_way === 'real time screen' ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  setPromotion_way('real time screen');
                }}
                color="#FA3E60"
              />
            </View>

            <View style={styles.dream_app_choose_for_you}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.videocam}
                  tintColor={'black'}
                  style={{marginRight: 6}}
                />
                <Text>{t('Promote Video')}</Text>
              </View>
              <RadioButton
                status={
                  promotion_way === 'with live video' ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  setPromotion_way('with live video');
                }}
                color="#FA3E60"
              />
            </View>
          </View>

          <View style={styles.defining_audience_view} />

          {/* defining audience */}
          <View style={styles.defining_audience}>
            <Text style={[styles.txt, {color: 'rgba(0, 0, 0, 1)'}]}>
              Define Your audience
            </Text>

            <View style={styles.dream_app_choose_for_you}>
              <Text>
                {t('Default audience')}
                {'\n'}({t('Dream app choose for you')} )
              </Text>
              <RadioButton
                status={audience ? 'checked' : 'unchecked'}
                onPress={() => {
                  setAudience(pre => !pre);
                }}
                color="#FA3E60"
              />
            </View>

            <View style={styles.dream_app_choose_for_you}>
              <Text>{t('Custom')}</Text>
              <Icon
                onPress={() => {
                  navigation.navigate('CustomAudienceScreen');
                }}
                source={icons.back}
                style={{transform: [{rotate: '180deg'}], marginRight: 6}}
              />
            </View>
          </View>

          {/* Bidget and duration */}
          <View style={styles.defining_audience}>
            <Text style={[styles.txt, {color: 'rgba(0, 0, 0, 1)'}]}>
              {t('Budget and duration')}
            </Text>
            <View style={styles.live_viewers}>
              <Text style={[styles.txt, {color: '#000'}]}>
                {Math.abs(max_reach)} - {Math.abs(min_reach)}
              </Text>
              <Text>{t('ESTIMATED LIVE Viewers')}</Text>
            </View>
          </View>

          <View style={styles.defining_audience_view} />

          {/* Total budget section */}
          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              What is your Daily budget?
            </Text>
            <Slider
              value={budget}
              onValueChange={handleBudgetChange}
              minimumValue={1}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => <CustomThumb value={budget} />}
            />
          </View>

          {/* total time of promotion  */}
          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              How long would you like to promote?
            </Text>
            <Slider
              value={promotion_time}
              onValueChange={handlePromotionChange}
              minimumValue={1}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => (
                <CustomThumb value={promotion_time} />
              )}
            />
          </View>

          {/* Bidget and duration */}
          <View style={styles.defining_audience}>
            <View style={styles.live_viewers}>
              <Text style={[styles.txt, {color: '#000'}]}>
                {Math.abs(min_like)} - {Math.abs(max_like)}
              </Text>
              <Text>{t('ESTIMATED LIVE Like')}</Text>
            </View>
          </View>

          <View style={styles.defining_audience_view} />

          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              Select the number of like.
            </Text>
            <Slider
              value={Math.round(like)}
              onValueChange={handleLikeChange}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => <CustomThumb value={like} />}
            />
          </View>

          {/* Bidget and duration */}
          <View style={styles.defining_audience}>
            <View style={styles.live_viewers}>
              <Text style={[styles.txt, {color: '#000'}]}>
                {Math.abs(min_followers)} - {Math.abs(max_folowers)}
              </Text>
              <Text>{t('ESTIMATED LIVE Followers')}</Text>
            </View>
          </View>

          <View style={styles.defining_audience_view} />

          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              {t('Select the number of followers.')}
            </Text>
            <Slider
              value={followers}
              onValueChange={handleFollowersChange}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => <CustomThumb value={followers} />}
            />
          </View>

          {/* Bidget and duration */}
          <View style={styles.defining_audience}>
            <View style={styles.live_viewers}>
              <Text style={[styles.txt, {color: '#000'}]}>
                {Math.abs(min_profile_visit)} - {Math.abs(max_profiel_visit)}
              </Text>
              <Text>{t('ESTIMATED LIVE Profile visit')}</Text>
            </View>
          </View>

          <View style={styles.defining_audience_view} />

          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              {t('Select the number of profile visit')}.
            </Text>
            <Slider
              value={Math.round(profile_visit)}
              onValueChange={handleProfileVisitChange}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => <CustomThumb value={profile_visit} />}
            />
          </View>

          <View style={styles.defining_audience_view} />

          {/* Bidget and duration */}
          <View style={styles.defining_audience}>
            <View style={styles.live_viewers}>
              <Text style={[styles.txt, {color: '#000'}]}>
                {Math.round(Math.abs(0.2))} - {Math.abs(max_comment)}
              </Text>
              <Text>{t('ESTIMATED LIVE comment')}</Text>
            </View>
          </View>

          <View style={styles.seperator_view}>
            <Text style={styles.slider_captions}>
              Select the number of comment
            </Text>
            <Slider
              value={Math.round(comment)}
              onValueChange={handleCommentChange}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              minimumTrackTintColor="#FA3E60"
              maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
              thumbTintColor="#C9B5B5"
              renderThumbComponent={() => <CustomThumb value={comment} />}
            />
          </View>

          <View style={{height: 50}} />
        </ScrollView>
      </View>

      {/* Bottomest parts */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: width,
          paddingBottom: 10,
          backgroundColor: '#fff',
          paddingHorizontal: width * 0.1,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={icons.coin}
            style={{width: 16, height: 16, marginRight: 5}}
          />
          <Text style={[styles.txt, {color: '#000'}]}>
            {my_data ? my_data.wallet : 0}
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.coin}
              style={{width: 14, height: 14, marginRight: 5}}
            />
            <Text style={[styles.txt, {color: '#000'}]}>
              {truncateText(final_budget.toString(), 7) * 120}
            </Text>
          </View>
          <Text style={[styles.txt, {color: '#000', marginLeft: 20}]}>
            ${truncateText(final_budget.toString(), 7)}
          </Text>
        </View>

        <CButton
          lable={'Buy'}
          style={{paddingHorizontal: 25}}
          onPress={makePayments}
        />
      </View>
    </View>
  );
};

export default Promotion;

const CustomThumb = ({value}) => {
  return (
    <View style={styles1.thumbContainer}>
      <Text style={styles1.thumbText}>{value}</Text>
      <View style={styles1.thumb} />
    </View>
  );
};

const styles1 = StyleSheet.create({
  thumbContainer: {
    width: 20,
    height: 60,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C9B5B5',
  },
  thumbText: {
    fontSize: 15,
    width: 80,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(14, 0, 0, 0.9)',
    flex: 1,
    alignItems: 'center',
    // paddingTop: StatusBar.currentHeight
  },
  upper_section: {
    backgroundColor: 'rgba(14, 0, 0, 0.9);',
    width: width,
    // height: height * 0.2,
    alignItems: 'center',
    // justifyContent: 'center'
  },
  icon_containers: {
    width: width,
    // height: height * 0.05,
    alignItems: 'flex-start',
    padding: 16,
  },
  picture_and_title_section: {
    width: width * 0.8,
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    flexDirection: 'row',
  },
  img: {
    width: 57,
    height: 57,
    borderRadius: 50,
  },
  input: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#ffffff',
  },
  topic_and_live_adding: {
    flexDirection: 'row',
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: height * 0.02,
  },
  txt: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  live_adding: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(179, 159, 159, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  promote_with_two_icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: width * 0.05,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  defining_audience: {
    width: width,
    marginTop: height * 0.02,
    paddingHorizontal: 10,
  },
  dream_app_choose_for_you: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
    paddingHorizontal: 10,
  },
  live_viewers: {
    width: '100%',
    backgroundColor: 'rgba(179, 159, 159, 0.2);',
    padding: 16,
  },
  bottom_section_header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  promote_text: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  way_of_pomotions_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  defining_audience_view: {
    width: width,
    height: 2,
    backgroundColor: '#D9D9D9',
    marginTop: 8,
  },
  way_to_promote: {
    width: width,
    paddingHorizontal: 10,
  },
  seperator_view: {
    marginTop: 30,
    width: width * 0.8,
  },
  slider_captions: {
    fontSize: 16,
    marginBottom: 25,
    color: '#020202',
    fontWeight: '600',
  },
});
