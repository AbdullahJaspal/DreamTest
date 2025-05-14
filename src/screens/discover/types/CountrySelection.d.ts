export interface CountrySelectionProps {
  country_id: number;
  country_name: string;
}

export type CountryProps = {
  active: number;
  capital: string;
  created_at: string;
  currency: string;
  emoji: string;
  emojiU: string;
  flag: number;
  flagurl: string | null;
  id: number;
  iso3: string;
  name: string;
  native: string;
  phonecode: string;
  region: string;
  short_name: string;
  subregion: string;
  updated_at: string;
  wikiDataId: string;
};

export interface CityProps {
  active: number;
  country_code: string;
  country_id: number;
  created_at: string;
  flag: number;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  state_code: string;
  state_id: number;
  updated_on: string;
  wikiDataId: string;
}

export interface SearchVideoProps {
  allow_comments: number;
  allow_duet: number;
  allow_stitch: number;
  block: number;
  comment: number;
  created: string;
  description: string;
  diamond_value: number;
  duet_video_id: number | null;
  duration: number | null;
  gif: string | null;
  id: number;
  like: number;
  old_video_id: number | null;
  privacy_type: string;
  profile_pic: string;
  promote: number;
  remix_video_id: number | null;
  section: string | null;
  shared: number;
  sound_id: number | null;
  thum: string;
  title: string;
  user_id: number;
  video: string;
  videoCountries: {
    id: number;
  };
  video_durations: number | null;
  video_topic: string | null;
  view: number;
}

export interface HashtagProps {
  id: number;
  title: string;
  num_of_video: number;
}
