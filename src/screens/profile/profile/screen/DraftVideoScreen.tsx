import {StyleSheet, View, Image, Text} from 'react-native';
import React, {useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useDispatch} from 'react-redux';
import {change_video_url} from '../../../../store/slices/content/videoSlice';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import RenderDraftPost from './RenderDraftPost';
import {ProfileScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {getItemLayout} from '../../../../utils/videoItemLayout';
import {icons} from '../../../../assets/icons';

interface DraftVideoScreenProps {
  data: any;
}

const privacy_type_cal = (v: string) => {
  if (v === 'public') {
    return false;
  } else {
    return true;
  }
};

const parseData = (data: string) => {
  const numbersArray = data?.split(',');
  const numbersArrayInt = numbersArray.map(num => parseInt(num, 10));
  return numbersArrayInt;
};

const parseString = (data: string) => {
  const numbersArray = data?.split(',');
  return numbersArray;
};

const DraftVideoScreen: React.FC<DraftVideoScreenProps> = ({data}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ProfileScreenNavigationProps>();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handlePostClick = async (index: number) => {
    try {
      if (!isClicked) {
        setIsClicked(true);
        Toast.show('Wait your request is processing', Toast.LONG);
        const video_details = data[index];
        const video_url = `https://dpcst9y3un003.cloudfront.net/${video_details.video}`;
        const thum_url = `https://dpcst9y3un003.cloudfront.net/${video_details?.thum}`;

        // Fetch video URL
        const video_res = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'mp4',
        }).fetch('GET', video_url);

        // Dispatch video URL
        dispatch(change_video_url(`file://${video_res.path()}`));

        // Fetch thumbnail URL
        const thum_res = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'jpeg',
        }).fetch('GET', thum_url);

        const thum_urli = `file://${thum_res.path()}`;

        navigation.navigate('PostVideoScreen', {
          durations: video_details?.duration,
          remix_video_id: video_details?.remix_video_id,
          allow_comments: video_details?.allow_comments,
          allow_duet: video_details?.allow_duet,
          allow_stitch: video_details?.allow_stitch,
          cities: parseData(video_details?.cities),
          countries: parseData(video_details?.countries),
          description: video_details?.description,
          hashtag: parseString(video_details?.hashtag),
          privacy_type: privacy_type_cal(video_details?.privacy_type),
          profile_pic: thum_urli,
          tag_people: parseString(video_details?.tag_people),
          tagged_people_id: parseData(video_details?.tagged_people_id),
          title: video_details?.title,
          video_topic: video_details?.video_topic,
          drafted_video_id: video_details?.id,
        });
        setIsClicked(false);
      } else {
        Toast.show('Please Wait your request is processing', Toast.LONG);
      }
    } catch (error) {
      console.error(error);
      setIsClicked(false);
    }
  };

  return (
    <Tabs.FlatList
      data={data}
      numColumns={3}
      ListFooterComponent={() => <View style={styles.bottom_view} />}
      //GeneralChange
      ListHeaderComponent={() => (
        <>
          {(!data || data.length === 0) && (
            <View style={styles.emptyContainer}>
              <Image source={icons.videocam} style={styles.empty_image} />
              <Text style={styles.emptyText}>No video posts available!</Text>
            </View>
          )}
          <View style={styles.header} />
        </>
      )}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
      getItemLayout={getItemLayout}
      renderItem={({item, index}) => (
        <RenderDraftPost
          item={item}
          index={index}
          onPostClick={handlePostClick}
        />
      )}
    />
  );
};

export default React.memo(DraftVideoScreen);

const styles = StyleSheet.create({
  bottom_view: {
    marginBottom: 90,
  },
  header: {
    height: 4,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  empty_image: {
    width: 70,
    height: 70,
    marginBottom: 20,
    resizeMode: 'contain',
    tintColor: 100,
  },
});

// import { StyleSheet, View, Image, Text } from 'react-native';
// import React, { useState } from 'react';
// import { Tabs } from 'react-native-collapsible-tab-view';
// import ReactNativeBlobUtil from 'react-native-blob-util';
// import { useDispatch } from 'react-redux';
// import { change_video_url } from '../../../../store/videoSlice';
// import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-simple-toast';
// import RenderDraftPost from './RenderDraftPost';
// import { ProfileScreenNavigationProps } from '../../../../types/screenNavigationAndRoute';
// import { getItemLayout } from '../../../../utils/videoItemLayout';

// interface DraftVideoScreenProps {
//   data: any;
// }

// const privacy_type_cal = (v: string) => {
//   if (v === 'public') {
//     return false;
//   } else {
//     return true;
//   }
// };

// const parseData = (data: string) => {
//   const numbersArray = data?.split(',');
//   const numbersArrayInt = numbersArray.map(num => parseInt(num, 10));
//   return numbersArrayInt;
// };

// const parseString = (data: string) => {
//   const numbersArray = data?.split(',');
//   return numbersArray;
// };

// const DraftVideoScreen: React.FC<DraftVideoScreenProps> = ({ data }) => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation<ProfileScreenNavigationProps>();
//   const [isClicked, setIsClicked] = useState<boolean>(false);

//   const handlePostClick = async (index: number) => {
//     try {
//       if (!isClicked) {
//         setIsClicked(true);
//         Toast.show('Wait your request is processing', Toast.LONG);
//         const video_details = data[index];
//         const video_url = `https://dpcst9y3un003.cloudfront.net/${video_details.video}`;
//         const thum_url = `https://dpcst9y3un003.cloudfront.net/${video_details?.thum}`;

//         // Fetch video URL
//         const video_res = await ReactNativeBlobUtil.config({
//           fileCache: true,
//           appendExt: 'mp4',
//         }).fetch('GET', video_url);

//         // Dispatch video URL
//         dispatch(change_video_url(`file://${video_res.path()}`));

//         // Fetch thumbnail URL
//         const thum_res = await ReactNativeBlobUtil.config({
//           fileCache: true,
//           appendExt: 'jpeg',
//         }).fetch('GET', thum_url);

//         const thum_urli = `file://${thum_res.path()}`;

//         navigation.navigate('PostVideoScreen', {
//           durations: video_details?.duration,
//           remix_video_id: video_details?.remix_video_id,
//           allow_comments: video_details?.allow_comments,
//           allow_duet: video_details?.allow_duet,
//           allow_stitch: video_details?.allow_stitch,
//           cities: parseData(video_details?.cities),
//           countries: parseData(video_details?.countries),
//           description: video_details?.description,
//           hashtag: parseString(video_details?.hashtag),
//           privacy_type: privacy_type_cal(video_details?.privacy_type),
//           profile_pic: thum_urli,
//           tag_people: parseString(video_details?.tag_people),
//           tagged_people_id: parseData(video_details?.tagged_people_id),
//           title: video_details?.title,
//           video_topic: video_details?.video_topic,
//           drafted_video_id: video_details?.id,
//         });
//         setIsClicked(false);
//       } else {
//         Toast.show('Please Wait your request is processing', Toast.LONG);
//       }
//     } catch (error) {
//       console.error(error);
//       setIsClicked(false);
//     }
//   };

//   return (
//     <Tabs.FlatList
//       data={data}
//       numColumns={3}
//       ListFooterComponent={() => <View style={styles.bottom_view} />}
//       // ListHeaderComponent={() => <View style={styles.header} />}
//       //GeneralChange
//       ListHeaderComponent={() => (
//         <>
//           {(!data || data.length === 0) && (
//             <View style={styles.emptyContainer}>
//               <Image source={icons.videocam} style={styles.empty_image} />
//               <Text style={styles.emptyText}>No video posts available!</Text>
//             </View>
//           )}
//           <View style={styles.header} />
//         </>
//       )}
//       windowSize={3}
//       initialNumToRender={3}
//       maxToRenderPerBatch={3}
//       removeClippedSubviews={true}
//       updateCellsBatchingPeriod={100}
//       getItemLayout={getItemLayout}
//       renderItem={({ item, index }) => (
//         <RenderDraftPost
//           item={item}
//           index={index}
//           onPostClick={handlePostClick}
//         />
//       )}
//     />
//   );
// };

// export default React.memo(DraftVideoScreen);

// const styles = StyleSheet.create({
//   bottom_view: {
//     marginBottom: 90,
//   },
//   header: {
//     height: 4,
//   },
//   emptyContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 100,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
//   empty_image: {
//     width: 70,
//     height: 70,
//     marginBottom: 20,
//     resizeMode: 'contain',
//     tintColor: 100,
//   },
// });
