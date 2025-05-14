import {Dimensions, StatusBar, StyleSheet} from 'react-native';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  main_conatiner: {
    flex: 1,
  },
  txt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  upper_container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: StatusBar.currentHeight,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  bottom_container: {
    width: width,
    position: 'absolute',
    height: 150,
    backgroundColor: '#54AD7A',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    marginTop: 20,
  },
  ringing: {
    color: 'grey',
    fontSize: 18,
    marginTop: 10,
  },
});
export default styles;
