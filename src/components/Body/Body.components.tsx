import React, {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BodyProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  applyPadding?: boolean;
}

const Body: React.FC<BodyProps> = ({children, style, applyPadding = true}) => {
  const insets = useSafeAreaInsets();

  const customStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    ...(applyPadding && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }),
  };

  return <View style={[customStyle, style]}>{children}</View>;
};

export default Body;
