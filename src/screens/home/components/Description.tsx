import React, {useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  useWindowDimensions,
} from 'react-native';
import CustomTextParser from './CustomTextParser';

interface DescriptionProps {
  title?: string;
  description?: string;
  addlink?: string;
  linktext?: string;
  linkwithimg?: any[];
}

const Description: React.FC<DescriptionProps> = ({
  title = '',
  description = '',
  addlink = '',
  linktext = '',
  linkwithimg = [],
}) => {
  const {width} = useWindowDimensions();

  const handleAdButtonPress = () => {
    if (addlink) {
      Linking.openURL(addlink).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  const layoutProperties = useMemo(() => {
    const hasLinkWithImages =
      Array.isArray(linkwithimg) && linkwithimg.length > 0;

    const hasButtonLink = Boolean(addlink && linktext);

    const containerProps = {
      bottom: hasButtonLink ? 5 : 50,

      width: hasLinkWithImages && hasButtonLink ? width * 0.62 : width * 0.87,

      backgroundColor: hasButtonLink
        ? 'rgba(0, 0, 0, 0.4)'
        : 'rgba(0, 0, 0, 0.05)',
    };

    return containerProps;
  }, [addlink, linktext, linkwithimg, width]);

  const shouldShowTitle = title?.length > 0;

  const shouldShowDescription = description?.length > 0;

  const shouldShowButton = Boolean(addlink && linktext);

  return (
    <View
      style={[
        styles.mainContainer,
        {
          bottom: layoutProperties.bottom,
          width: layoutProperties.width,
          right: 5,
        },
      ]}>
      <View
        style={[
          styles.container,
          {backgroundColor: layoutProperties.backgroundColor},
        ]}>
        {shouldShowTitle && (
          <View
            style={[
              styles.titleView,
              {backgroundColor: layoutProperties.backgroundColor},
            ]}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}

        {shouldShowDescription && <CustomTextParser des={description} />}
      </View>

      {shouldShowButton && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={linktext}
          style={styles.buttonView}
          onPress={handleAdButtonPress}>
          <Text style={styles.buttonText}>{linktext.toUpperCase()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 10,
    position: 'absolute',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  titleView: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  titleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  buttonView: {
    width: '100%',
    backgroundColor: '#efd756',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    marginTop: 4,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default React.memo(Description);
