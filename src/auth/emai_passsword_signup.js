import auth from '@react-native-firebase/auth';

auth()
  .createUserWithEmailAndPassword(
    'shubhamwrs10@gmail.com',
    'ramlal@ramlaa0923R',
  )
  .then(res => {
    console.log(res);
  });
