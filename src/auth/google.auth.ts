import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '549099161334-vcrplrh8dmpv3cuij8rmj0m9bf8q44g3.apps.googleusercontent.com',
});

export async function onGoogleButtonPress() {
  // Ensure Google Play services are available
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  // Sign in using Google
  const userInfo = await GoogleSignin.signIn();

  const idToken = userInfo?.data?.idToken;

  // Check if ID token is available
  if (!idToken) {
    throw new Error('Google ID token not found');
  }

  // Create a Google credential using the ID token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign in with the Google credential
  return auth().signInWithCredential(googleCredential);
}
