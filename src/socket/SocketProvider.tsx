import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import {useAppSelector} from '../store/hooks';
import {selectMyProfileData} from '../store/selectors';
import {useDispatch} from 'react-redux';
import {setConnectionStatus} from '../store/slices/common/socketSlice';
import SocketManager from './SocketManager';

interface SocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  emit: (event: string, data: any, callback?: Function) => void;
  on: (event: string, listener: (data: any) => void) => () => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  isConnecting: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  emit: () => {},
  on: () => () => {},
  reconnect: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
  const dispatch = useDispatch();
  const myData = useAppSelector(selectMyProfileData);
  const socketManager = SocketManager.getInstance();
  const prevAuthRef = useRef<string | null>(null);
  const prevUserIdRef = useRef<string | number | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    if (myData?.auth_token && myData?.id) {
      if (
        prevAuthRef.current !== myData.auth_token ||
        prevUserIdRef.current !== myData.id
      ) {
        socketManager.initialize(myData.auth_token, myData.id);
        setIsConnecting(socketManager.isConnectingInProgress());

        prevAuthRef.current = myData.auth_token;
        prevUserIdRef.current = myData.id;
      }
    }

    const unsubscribe = socketManager.addConnectionListener(connected => {
      setIsConnected(connected);
      setIsConnecting(socketManager.isConnectingInProgress());
      dispatch(setConnectionStatus(connected));
    });

    return () => {
      unsubscribe();
    };
  }, [myData?.auth_token, myData?.id, dispatch]);

  useEffect(() => {
    return () => {};
  }, []);

  const contextValue: SocketContextType = {
    isConnected,
    isConnecting,
    joinRoom: (roomId: string) => socketManager.joinRoom(roomId),
    leaveRoom: (roomId: string) => socketManager.leaveRoom(roomId),
    emit: (event: string, data: any, callback?: Function) =>
      socketManager.emit(event, data, callback),
    on: (event: string, listener: (data: any) => void) =>
      socketManager.on(event, listener),
    reconnect: () => socketManager.reconnect(),
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};

export default SocketProvider;
