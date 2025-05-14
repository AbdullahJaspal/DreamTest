import React, {useCallback, useEffect, useState} from 'react';
import Followers_Followings from '../components/Followers_Followings';
import {useRoute} from '@react-navigation/native';
import {getFollowingsDetails} from '../../../../apis/userApi';
import {FollowingsScreenRouteProps} from '../../../../types/screenNavigationAndRoute';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const Followings: React.FC = () => {
  const route = useRoute<FollowingsScreenRouteProps>();
  const user_id = route?.params?.user_id;
  const [Loading, setLoading] = useState(true);
  const my_data = useAppSelector(selectMyProfileData);
  const [data, setData] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const getDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFollowingsDetails(user_id);
      const myFollowers = await getFollowingsDetails(my_data?.id);
      setData(data?.Following);
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
      headertext={`Followings(${data?.length})`}
      Loading={Loading}
      data={data}
      followingList={followingList}
    />
  );
};

export default Followings;
