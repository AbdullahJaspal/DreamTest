import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import RenderFavTab from './favtab/RenderFavTab';

const FavouritePost: React.FC = () => {
  return (
    <Tabs.FlatList
      data={['']}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={({item, index}) => <RenderFavTab item={item} index={index} />}
    />
  );
};

export default React.memo(FavouritePost);
