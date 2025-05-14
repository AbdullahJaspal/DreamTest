import {VideoData} from '../screens/other_user/types/VideoData';

export function getItemLayout(
  data: ArrayLike<VideoData> | null | undefined,
  index: number,
): {length: number; offset: number; index: number} {
  const itemHeight = 180;
  const rowIndex = Math.floor(index / 3);
  return {
    length: itemHeight,
    offset: rowIndex * itemHeight,
    index,
  };
}
