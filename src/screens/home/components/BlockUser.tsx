import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Modal, SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import * as userApi from '../../../apis/userApi';
import {USER_EVENTS} from '../../../socket/events';
import {useAppSelector} from '../../../store/hooks';
import {useSocket} from '../../../socket/SocketProvider';
import {selectMyProfileData} from '../../../store/selectors';
import {setVideoPlayBack} from '../../../store/slices/ui/indexSlice';

interface BlockUserProps {
  remainingTime: number;
  user_id: number;
}

const BlockUser: React.FC = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();
  const {on} = useSocket();

  const [blockDetails, setBlockDetails] = useState<BlockUserProps>({
    remainingTime: 0,
    user_id: -1,
  });

  // Setup block/unblock listeners
  useEffect(() => {
    // Handle user block event
    const blockUnsubscribe = on(
      USER_EVENTS.USER_BLOCKED,
      (data: BlockUserProps) => {
        setBlockDetails(data);
        dispatch(setVideoPlayBack(false));
      },
    );

    // Handle user unblock event
    const unblockUnsubscribe = on(
      USER_EVENTS.USER_UNBLOCKED,
      (data: BlockUserProps) => {
        setBlockDetails(data);
        dispatch(setVideoPlayBack(true));
      },
    );

    // Cleanup listeners on unmount
    return () => {
      blockUnsubscribe();
      unblockUnsubscribe();
    };
  }, [on, dispatch]);

  const getUserBlocked = async () => {
    try {
      const result = await userApi.IsUserBlocked(my_data?.auth_token);
      setBlockDetails(result.remainingTime);
      if (result.remainingTime?.remainingTime > 0) {
        dispatch(setVideoPlayBack(false));
      }
    } catch (error) {
      console.log('Error generated while getting block details', error);
    }
  };

  useEffect(() => {
    getUserBlocked();
  }, [my_data]);

  useEffect(() => {
    if (blockDetails.remainingTime > 0) {
      const interval = setInterval(() => {
        setBlockDetails(prevBlockDetails => {
          const newTime = prevBlockDetails.remainingTime - 1;
          if (newTime <= 0) {
            dispatch(setVideoPlayBack(true));
          }
          return {
            ...prevBlockDetails,
            remainingTime: newTime,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blockDetails, dispatch]);

  if (blockDetails.remainingTime === 0) {
    return null;
  }

  const hours = Math.floor(blockDetails.remainingTime / 3600);
  const minutes = Math.floor((blockDetails.remainingTime % 3600) / 60);
  const seconds = blockDetails.remainingTime % 60;

  if (!!!blockDetails.remainingTime) {
    return null;
  }

  return (
    <SafeAreaView>
      <Modal
        transparent={true}
        visible={!!blockDetails.remainingTime}
        statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Your Account has been blocked</Text>
            <View style={styles.timeContainer}>
              <TimeBox label="Hours" value={hours} />
              <TimeBox label="Minutes" value={minutes} />
              <TimeBox label="Seconds" value={seconds} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const TimeBox: React.FC<{value: number; label: string}> = ({value, label}) => (
  <View style={styles.timeBox}>
    <Text style={styles.timeText}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default React.memo(BlockUser);
