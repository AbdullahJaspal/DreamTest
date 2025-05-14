import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  typingContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingLeft: 16,
    alignItems: 'center',
  },
  typingText: {
    color: '#555',
    fontSize: 12,
    marginRight: 6,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#54AD7A',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDot1: {
    animationName: 'typingAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0s',
  },
  typingDot2: {
    animationName: 'typingAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.2s',
  },
  typingDot3: {
    animationName: 'typingAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.4s',
  },
  offlineContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  offlineText: {
    color: '#FF5252',
    fontSize: 12,
    marginLeft: 6,
  },
  reconnectButton: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#54AD7A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reconnectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
export default styles;
