import {
  StyleSheet,
  FlatList,
  FlatListProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';

interface ListViewProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: {item: T; index: number}) => React.ReactElement;
  style?: StyleProp<ViewStyle>;
  ListHeaderComponent?: React.ReactElement | null;
}

const ListView = <T,>({
  data,
  renderItem,
  style = {},
  ListHeaderComponent,
}: ListViewProps<T>) => {
  return (
    <FlatList
      scrollEventThrottle={16}
      data={data}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollToOverflowEnabled={true}
      nestedScrollEnabled={true}
      contentContainerStyle={[styles.flatListOption, style]}
    />
  );
};

export default ListView;

const styles = StyleSheet.create({
  flatListOption: {},
});
