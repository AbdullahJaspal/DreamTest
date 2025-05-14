import {configureStore} from '@reduxjs/toolkit';

import {rootReducer} from './rootReducer';
const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('appState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Error loading state from localStorage:', e);
    return undefined;
  }
}

function saveToLocalStorage(state: RootState) {
  try {
    const stateToPersist = {
      themeColor: state.themeColor,
      my_data: {
        isLogin: state.my_data.isLogin,
        my_profile_data: state.my_data.my_profile_data,
      },
    };
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem('appState', serializedState);
  } catch (e) {
    console.warn('Error saving state to localStorage:', e);
  }
}
