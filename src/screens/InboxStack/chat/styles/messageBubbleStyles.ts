import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('screen');

const BUBBLE_MAX_WIDTH = width * 0.75;

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },

  // System message
  systemMessageContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
    maxWidth: '70%',
  },
  systemMessageText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Bubble styles
  bubbleContainer: {
    maxWidth: BUBBLE_MAX_WIDTH,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sentBubble: {
    borderTopRightRadius: 2,
  },
  receivedBubble: {
    backgroundColor: '#EEEEEE',
    borderTopLeftRadius: 2,
  },

  // Link preview styles
  LinkPreview: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  PreviewImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
    resizeMode: 'cover',
  },
  LogoContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b5cff',
  },
  LogoImage: {
    width: 100,
    height: 100,
  },
  PreviewTextContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  PreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  PreviewDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  PreviewUrl: {
    fontSize: 12,
    color: '#888',
  },
  LinkHighlight: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  LinkText: {
    fontSize: 12,
    color: '#0b5cff',
  },

  videoThumbnailContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 4,
  },
  videoPlaceholder: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  linkPreviewContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linkPreviewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  linkText: {
    marginTop: 4,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  videoLinkPreview: {
    marginBottom: 8,
  },
  videoThumbnailPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  websiteLinkPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  websiteIconContainer: {
    marginRight: 8,
  },

  videoPlatformPreview: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  platformLogo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  platformText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Media bubbles
  mediaBubbleContainer: {
    maxWidth: BUBBLE_MAX_WIDTH,
    width: BUBBLE_MAX_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    position: 'relative',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  sentMediaBubble: {
    borderTopRightRadius: 2,
  },
  receivedMediaBubble: {
    borderTopLeftRadius: 2,
  },

  mediaImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    alignSelf: 'center',
    borderRadius: 10,
  },
  mediaImageFallback: {
    width: BUBBLE_MAX_WIDTH,
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mediaCaption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mediaOverlay: {
    padding: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // File message
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 8,
  },
  fileName: {
    fontWeight: '500',
    marginBottom: 2,
  },

  // Location message
  locationContainer: {
    minWidth: 150,
    paddingVertical: 8,
  },
  locationPreview: {
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Contact message
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 150,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    opacity: 0.8,
  },

  // Audio message
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 150,
  },
  audioPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  audioWaveform: {
    flex: 1,
  },

  // Text styles
  sentText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  receivedText: {
    color: '#000000',
    fontSize: 16,
  },

  // Message footer
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 15,
  },
  timestamp: {
    fontSize: 11,
    marginRight: 4,
  },
  timestampSent: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timestampReceived: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  statusContainer: {
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Upload progress bar
  uploadProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  uploadProgressBar: {
    height: '100%',
    backgroundColor: '#53bdeb',
  },

  replyContainer: {
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#54AD7A',
    paddingLeft: 8,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingRight: 8,
    width: 200,
  },
  replyBar: {
    width: 2,
    backgroundColor: '#54AD7A',
    marginRight: 6,
  },
  replyContent: {
    flex: 1,
  },
  replySenderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#54AD7A',
  },
  replyPreview: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
