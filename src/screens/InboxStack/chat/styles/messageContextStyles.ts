import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
  },
  menuItemText: {
    color: '#000',
    fontSize: 16,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default styles;
