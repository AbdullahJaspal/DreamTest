import React, {useCallback, useEffect, useState} from 'react';
import Followers_Followings from '../components/Followers_Followings';
import {useRoute} from '@react-navigation/native';
import {
  getFollowersDetails,
  getFollowingsDetails,
} from '../../../../apis/userApi';
import {FollowersScreenRouteProps} from '../../../../types/screenNavigationAndRoute';
import {formatNumber} from '../../../../utils/formatNumber';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const Followers = () => {
  const route = useRoute<FollowersScreenRouteProps>();
  const user_id: number = route?.params?.user_id ?? 0;
  const my_data = useAppSelector(selectMyProfileData);
  const [Loading, setLoading] = useState<boolean>(true);
  const [followingList, setFollowingList] = useState([]);
  const [data, setData] = useState([]);

  const getDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFollowersDetails(user_id);
      const myFollowers = await getFollowingsDetails(my_data?.id);
      setData(data?.Followers);
      setFollowingList(myFollowers?.Following);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user_id, my_data?.id]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  return (
    <Followers_Followings
      headertext={`Followers(${formatNumber(data?.length)})`}
      Loading={Loading}
      data={data}
      followingList={followingList}
    />
  );
};

export default Followers;
