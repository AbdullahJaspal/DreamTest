import io, {Socket} from 'socket.io-client';
import {Platform, AppState, AppStateStatus} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import {SERVER_API_URL} from '../constants/constants';
import {socketLogger} from './utils/socketLogger';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private appState: AppStateStatus = AppState.currentState;
  private networkUnsubscribe: (() => void) | null = null;
  private appStateSubscription: {remove: () => void} | null = null;

  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  private authToken: string | null = null;
  private userId: string | number | null = null;
  private isInitialized: boolean = false;
  private lastConnectionAttempt: number = 0;
  private connectionThrottleMs: number = 3000; // Minimum time between connection attempts

  private constructor() {
    this.setupNetworkListeners();
    this.setupAppStateListeners();
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private getAdjustedServerUrl(): string {
    if (Platform.OS === 'ios') {
      return SERVER_API_URL;
    } else if (Platform.OS === 'android') {
      return SERVER_API_URL.replace('localhost', '10.0.2.2').replace(
        '127.0.0.1',
        '10.0.2.2',
      );
    }
    return SERVER_API_URL;
  }

  public initialize(authToken: string, userId: string | number): void {
    // Check if already initialized with same credentials
    if (
      this.isInitialized &&
      this.authToken === authToken &&
      this.userId === userId &&
      this.isConnected()
    ) {
      socketLogger.log('Already initialized and connected, skipping');
      return;
    }

    // Only update if different
    if (this.authToken !== authToken || this.userId !== userId) {
      socketLogger.log('Updating credentials');
      this.authToken = authToken;
      this.userId = userId;
      this.isInitialized = true;

      // If we're updating credentials, disconnect existing socket
      if (this.socket) {
        this.disconnect();
      }

      this.connect();
    } else if (!this.isConnected() && !this.isConnecting) {
      // Same credentials but not connected, try to connect
      socketLogger.log('Same credentials, attempting reconnect');
      this.connect();
    }
  }

  public connect(): Socket | null {
    if (!this.authToken) {
      socketLogger.log('Cannot connect - No auth token available');
      return null;
    }

    // Check if already connected
    if (this.socket && this.socket.connected) {
      socketLogger.log('Already connected, skipping new connection');
      return this.socket;
    }

    if (this.isConnecting) {
      socketLogger.log('Already attempting to connect, skipping');
      return null;
    }

    // Throttle connection attempts
    const now = Date.now();
    if (now - this.lastConnectionAttempt < this.connectionThrottleMs) {
      socketLogger.log('Connection attempt throttled');
      return null;
    }
    this.lastConnectionAttempt = now;

    this.isConnecting = true;
    const serverUrl = this.getAdjustedServerUrl();
    socketLogger.log('Attempting connection to:', serverUrl);

    if (this.socket) {
      socketLogger.log('Cleaning up existing socket instance');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    try {
      const newSocket = io(serverUrl, {
        auth: {
          token: this.authToken,
        },
        reconnection: false, // Disable auto-reconnection, we'll handle it manually
        timeout: 15000,
        transports: ['websocket', 'polling'],
        forceNew: true,
        query: {
          userId: this.userId,
        },
      });

      socketLogger.log('Socket instance created');

      this.socket = newSocket;
      this.setupSocketEventListeners(newSocket);

      return newSocket;
    } catch (error: any) {
      socketLogger.error('Error creating connection:', error);
      this.isConnecting = false;
      Toast.show(
        `Socket error: ${error.message || 'Unknown error'}`,
        Toast.SHORT,
      );
      return null;
    }
  }

  private setupSocketEventListeners(socket: Socket): void {
    socket.on('connect', () => {
      socketLogger.log('CONNECTED SUCCESSFULLY WITH ID:', socket.id);
      this.isConnecting = false;
      this.reconnectAttempts = 0;

      if (this.userId) {
        socketLogger.log('Emitting online-display with ID:', this.userId);
        socket.emit('online-display', {myId: this.userId});
      }

      this.notifyConnectionListeners(true);
    });

    socket.on('disconnect', reason => {
      socketLogger.log('Disconnected. Reason:', reason);
      this.isConnecting = false;

      this.notifyConnectionListeners(false);

      // Only attempt auto-reconnect for non-intentional disconnects
      if (
        reason !== 'io client disconnect' &&
        reason !== 'io server disconnect'
      ) {
        this.scheduleReconnect();
      }
    });

    socket.on('connect_error', error => {
      socketLogger.error('CONNECTION ERROR:', error.message);
      this.isConnecting = false;

      this.notifyConnectionListeners(false);

      // Show connection error to user if not an auth error
      if (!error.message.includes('auth')) {
        Toast.show(`Connection error: ${error.message}`, Toast.SHORT);
      }

      this.scheduleReconnect();
    });

    // Re-attach all existing event listeners
    this.eventListeners.forEach((listeners, event) => {
      socket.on(event, data => {
        socketLogger.log(`Received ${event}:`, data);
        this.notifyEventListeners(event, data);
      });
    });
  }

  private scheduleReconnect(): void {
    // Clean up any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const backoffTime = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000,
    );
    socketLogger.log(`Will attempt reconnect in ${backoffTime}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts += 1;
      this.connect();
    }, backoffTime);
  }

  public disconnect(): void {
    if (this.socket) {
      socketLogger.log('Disconnecting socket');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.isConnecting = false;
    this.notifyConnectionListeners(false);
  }

  public emit(event: string, data: any, callback?: Function): void {
    if (!this.socket || !this.socket.connected) {
      socketLogger.log(`Cannot emit ${event}: Socket not connected`);
      return;
    }

    socketLogger.log(`Emitting ${event}:`, data);
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, listener: (data: any) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());

      if (this.socket) {
        this.socket.on(event, data => {
          socketLogger.log(`Received ${event}:`, data);
          this.notifyEventListeners(event, data);
        });
      }
    }

    this.eventListeners.get(event)!.add(listener);

    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.eventListeners.delete(event);
          if (this.socket) {
            this.socket.off(event);
          }
        }
      }
    };
  }

  public joinRoom(roomId: string): void {
    if (!this.socket || !this.socket.connected) {
      socketLogger.log('Cannot join room: Socket not connected');
      return;
    }

    socketLogger.log('Joining room:', roomId);
    this.socket.emit('joinRoom', roomId);
  }

  public leaveRoom(roomId: string): void {
    if (!this.socket || !this.socket.connected) {
      socketLogger.log('Cannot leave room: Socket not connected');
      return;
    }

    socketLogger.log('Leaving room:', roomId);
    this.socket.emit('leaveRoom', roomId);
  }

  public addConnectionListener(
    listener: (connected: boolean) => void,
  ): () => void {
    this.connectionListeners.add(listener);

    if (this.socket) {
      listener(this.socket.connected);
    } else {
      listener(false);
    }

    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        socketLogger.error('Error in connection listener:', error);
      }
    });
  }

  private notifyEventListeners(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          socketLogger.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  private setupNetworkListeners(): void {
    this.networkUnsubscribe = NetInfo.addEventListener(state => {
      const isNetworkConnected = state.isConnected ?? false;

      if (
        isNetworkConnected &&
        this.socket &&
        !this.socket.connected &&
        !this.isConnecting
      ) {
        socketLogger.log('Network reconnected, attempting socket connection');
        this.connect();
      }
    });
  }

  private setupAppStateListeners(): void {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          this.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          socketLogger.log('App has come to the foreground');
          if (this.socket && !this.socket.connected && !this.isConnecting) {
            socketLogger.log('Reconnecting after app foregrounded');
            this.connect();
          }
        }

        this.appState = nextAppState;
      },
    );
  }

  public reconnect(): void {
    socketLogger.log('Manual reconnection requested');
    Toast.show('Reconnecting...', Toast.SHORT);
    this.reconnectAttempts = 0;
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 500); // Small delay to ensure clean disconnect
  }

  public isConnected(): boolean {
    return !!(this.socket && this.socket.connected);
  }

  public isConnectingInProgress(): boolean {
    return this.isConnecting;
  }

  public cleanup(): void {
    if (this.socket) {
      socketLogger.log('Cleaning up socket connection');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.networkUnsubscribe) {
      this.networkUnsubscribe();
      this.networkUnsubscribe = null;
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    this.connectionListeners.clear();
    this.eventListeners.clear();
    this.isInitialized = false;
    this.authToken = null;
    this.userId = null;
  }
}

export default SocketManager;
