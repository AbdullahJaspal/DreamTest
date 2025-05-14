import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#777',
  },
  activeTabLabel: {
    color: '#E53935',
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    backgroundColor: '#E53935',
    borderRadius: 1.5,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  notificationItem: {
    padding: 16,
  },
  notificationItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },

  followButton: {
    backgroundColor: '#E53935',
  },
  friendButton: {
    backgroundColor: '#666',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  videoContent: {
    flex: 1,
    marginLeft: 12,
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 8,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  replyText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 16,
  },
});

export default styles;
