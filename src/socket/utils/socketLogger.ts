const DEBUG_MODE = process.env.NODE_ENV === 'development';

export const socketLogger = {
  log: (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log('[SOCKET]', ...args);
    }
  },

  error: (...args: any[]) => {
    if (DEBUG_MODE) {
      console.error('[SOCKET ERROR]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (DEBUG_MODE) {
      console.warn('[SOCKET WARNING]', ...args);
    }
  },

  debug: (...args: any[]) => {
    if (DEBUG_MODE) {
      console.debug('[SOCKET DEBUG]', ...args);
    }
  },
};
