import {Dimensions, Platform, StyleSheet} from 'react-native';

const {width} = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(84, 173, 122, 0.1)',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#54AD7A',
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  roseIcon: {
    width: 24,
    height: 24,
  },

  // Emoji panel styles
  emojiPanel: {
    paddingVertical: 10,
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: '#54AD7A',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  emojiGrid: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  emojiItem: {
    width: width / 5 - 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 28,
  },

  // Rose panel styles
  rosePanel: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  roseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  roseImageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginBottom: 40,
  },
  roseLargeImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  roseCountOverlay: {
    position: 'absolute',
    right: -2,
    bottom: -20,
    backgroundColor: '#54AD7A',
    color: '#FFFFFF',
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 'bold',
    height: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roseCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roseInfoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 16,
    color: '#555',
  },
  coinWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  costValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  walletLabel: {
    fontSize: 16,
    color: '#555',
  },
  walletBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roseCountList: {
    paddingVertical: 15,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  roseCountOption: {
    width: 20,
    height: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 8,
  },
  selectedRoseCount: {
    backgroundColor: '#54AD7A',
  },
  roseCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  selectedRoseCountText: {
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#54AD7A',
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#A8D4BC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default styles;
