import React, {memo, useState, useCallback, useEffect} from 'react';
import {View, TouchableOpacity, FlatList, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../styles/roseStyles';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {useAppSelector} from '../../../../store/hooks';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {selectMyProfileData} from '../../../../store/selectors';
import {setRechargeSheet} from '../../../../store/slices/ui/indexSlice';
import {update_wallet_diamond} from '../../../../store/slices/user/my_dataSlice';
import Text from '../../../../components/Text';
import {images} from '../../../../assets/images';
import {icons} from '../../../../assets/icons';

const ROSE_COST = 10;
const ROSE_MULTIPLIERS = [1, 5, 10, 20, 30, 50, 60, 99];

interface RoseProps {
  onEmojiSelected?: (emoji: string) => void;
  onRoseSend?: (count: number) => void;
  onClose?: () => void;
}

const Rose: React.FC<RoseProps> = ({onEmojiSelected, onRoseSend, onClose}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const myData = useAppSelector(selectMyProfileData);
  const [activeTab, setActiveTab] = useState('emoji');
  const [roseCount, setRoseCount] = useState(1);
  const [totalCost, setTotalCost] = useState(ROSE_COST);

  useEffect(() => {
    setTotalCost(roseCount * ROSE_COST);
  }, [roseCount]);

  const handleEmojiTap = useCallback(
    (emoji: string) => {
      if (onEmojiSelected) {
        onEmojiSelected(emoji);
      }
      if (onClose) {
        onClose();
      }
    },
    [onEmojiSelected, onClose],
  );

  const handleRoseCountSelect = useCallback((count: number) => {
    setRoseCount(count);
  }, []);

  const handleSendRoses = useCallback(async () => {
    const walletBalance = myData?.wallet || 0;

    if (walletBalance >= totalCost) {
      try {
        dispatch(update_wallet_diamond(walletBalance - totalCost));
        if (onRoseSend) {
          onRoseSend(roseCount);
        }

        Toast.show(t('Roses sent successfully!'), Toast.SHORT);

        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Error sending roses:', error);
        Toast.show(t('Failed to send roses'), Toast.SHORT);
      }
    } else {
      // Not enough balance, show recharge sheet
      dispatch(setRechargeSheet(true));
    }
  }, [myData, totalCost, roseCount, dispatch, onRoseSend, onClose, t]);

  // Render an emoji item
  const renderEmojiItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.emojiItem}
        onPress={() => handleEmojiTap(item)}
        activeOpacity={0.7}>
        <Text style={styles.emojiText}>{item}</Text>
      </TouchableOpacity>
    ),
    [handleEmojiTap],
  );

  // Render rose multiplier option
  const renderRoseMultiplier = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={[
          styles.roseCountOption,
          roseCount === item && styles.selectedRoseCount,
        ]}
        onPress={() => handleRoseCountSelect(item)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.roseCountText,
            roseCount === item && styles.selectedRoseCountText,
          ]}>
          {item}x
        </Text>
      </TouchableOpacity>
    ),
    [roseCount, handleRoseCountSelect],
  );

  return (
    <View style={styles.container}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <View
          style={[styles.tabButton, activeTab === 'rose' && styles.activeTab]}
          activeOpacity={0.7}>
          <Image source={images.rose} style={styles.roseIcon} />
          <Text
            style={[
              styles.tabText,
              activeTab === 'rose' && styles.activeTabText,
            ]}>
            {t('Rose')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}>
          <MaterialIcons name="close" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Rose Panel */}
      <View style={styles.rosePanel}>
        <View style={styles.roseContent}>
          {/* Rose icon */}
          <View style={styles.roseImageContainer}>
            <Image source={images.rose} style={styles.roseLargeImage} />
            <View style={styles.roseCountOverlay}>
              <Text style={styles.roseCount}>{roseCount}x</Text>
            </View>
          </View>

          {/* Rose info section */}
          <View style={styles.roseInfoSection}>
            {/* Cost info */}
            <View style={styles.costContainer}>
              <Text style={styles.costLabel}>{t('Cost')}</Text>
              <View style={styles.coinWrapper}>
                <Image source={icons.coin} style={styles.coinIcon} />
                <Text style={styles.costValue}>{totalCost}</Text>
              </View>
            </View>

            {/* Wallet balance */}
            <View style={styles.walletContainer}>
              <Text style={styles.walletLabel}>{t('Balance')}</Text>
              <View style={styles.coinWrapper}>
                <Image source={icons.coin} style={styles.coinIcon} />
                <Text style={styles.walletBalance}>{myData?.wallet || 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rose count options */}
        <FlatList
          data={ROSE_MULTIPLIERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `rose-${item}`}
          renderItem={renderRoseMultiplier}
          contentContainerStyle={styles.roseCountList}
        />

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (myData?.wallet || 0) < totalCost && styles.disabledSendButton,
          ]}
          onPress={handleSendRoses}
          disabled={(myData?.wallet || 0) < totalCost}
          activeOpacity={0.7}>
          <Text style={styles.sendButtonText}>{t('Send Roses')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Rose);
