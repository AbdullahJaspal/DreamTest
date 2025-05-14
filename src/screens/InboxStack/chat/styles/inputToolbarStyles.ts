import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mainContainer: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 10,
    marginVertical: 10,
    minHeight: 40,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 120,
    minHeight: 40,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  cameraButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#54AD7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  fontIndicator: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 1,
  },
  fontIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  replyingSendButton: {
    // Optional: you could highlight the send button when replying
    backgroundColor: 'rgba(84, 173, 122, 0.1)',
  },
  sendIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#54AD7A',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 12,
  },
  recordingTimText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recordingStopButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 18,
  },
  text: {
    fontSize: 14,
    color: '#020202',
  },

  attachmentsContainer: {
    backgroundColor: '#54AD7A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  attachmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  attachmentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  attachmentsList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  attachmentOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  attachmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default styles;
