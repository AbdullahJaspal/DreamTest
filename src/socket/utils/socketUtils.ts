export const generateRoomId = (
  userId1: string | number,
  userId2: string | number,
): string => {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}${sortedIds[1]}`;
};

export const handleConnectionError = (error: Error): string => {
  if (error.message.includes('timeout')) {
    return 'Connection timed out. Please check your internet connection.';
  }

  if (error.message.includes('auth')) {
    return 'Authentication failed. Please log in again.';
  }

  return error.message || 'Unknown connection error occurred.';
};

export const isValidConnection = (socket: any | null): boolean => {
  return !!(socket && socket.connected);
};

export const getAdjustedServerUrl = (
  serverUrl: string,
  platform: string,
): string => {
  if (platform === 'ios') {
    return serverUrl;
  } else if (platform === 'android') {
    return serverUrl
      .replace('localhost', '10.0.2.2')
      .replace('127.0.0.1', '10.0.2.2');
  }
  return serverUrl;
};

export const calculateBackoffTime = (
  attempts: number,
  maxTimeMs: number = 30000,
): number => {
  return Math.min(1000 * 2 ** attempts, maxTimeMs);
};
