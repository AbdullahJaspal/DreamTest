import {MediaType} from '../../screens/newVideo/enum/MediaType';

export type NewVideoStackParamsList = {
  NewVideoScreen: undefined;
  PreviewVideoScreen: undefined;
  PostVideoScreen: undefined;
  PostPictureScreen: undefined;
  MediaPickupScreen: {mediaType: MediaType};
  SelectingCitiesScreen: undefined;
  CoverPicScreen: undefined;
  SelectingLocationScreen: undefined;
  TrimVideo: undefined;
};
