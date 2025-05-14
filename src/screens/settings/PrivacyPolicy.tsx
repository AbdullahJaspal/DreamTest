import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../profile/profile/components/Header';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const PrivacyPolicy: React.FC = () => {
  const privacyUrl =
    'https://newspakupdat.blogspot.com/p/privacy-policy-of-dream-application.html';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header headertext={'Privacy Policy'} />
        <WebView
          source={{uri: privacyUrl}}
          startInLoadingState={true}
          style={styles.web_view}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#000"
              style={styles.loader}
            />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  web_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
