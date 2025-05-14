import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AccountType} from '../../../enum/accountTypes';

export interface LocationSelectionState {
  noOFCountryAllowedToSelect: number;
  isAllSelectionAllowedInCountry: boolean;
  noOFCitiesAllowedToSelect: number;
  isAllSelectionAllowedInCities: boolean;
  showBadgeModal: boolean;
  badgeType: AccountType | null;
}

export type InitialState = LocationSelectionState;

const initialState: LocationSelectionState = {
  noOFCountryAllowedToSelect: 3,
  isAllSelectionAllowedInCountry: false,
  noOFCitiesAllowedToSelect: 3,
  isAllSelectionAllowedInCities: false,
  showBadgeModal: false,
  badgeType: null,
};

const locationSlice = createSlice({
  name: 'location_selection',
  initialState,
  reducers: {
    setNoOFCountryAllowedToSelect: (state, action: PayloadAction<number>) => {
      state.noOFCountryAllowedToSelect = action.payload;
    },
    setIsAllSelectionAllowedInCountry: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isAllSelectionAllowedInCountry = action.payload;
    },
    setNoOFCitiesAllowedToSelect: (state, action: PayloadAction<number>) => {
      state.noOFCitiesAllowedToSelect = action.payload;
    },
    setIsAllSelectionAllowedInCities: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isAllSelectionAllowedInCities = action.payload;
    },
    resetSelection: () => initialState,
    toggleBadgeModal: (state, action: PayloadAction<boolean>) => {
      state.showBadgeModal = action.payload;
    },
    setBadgeType: (state, action: PayloadAction<AccountType>) => {
      state.badgeType = action.payload;
    },
  },
});

export const {
  setNoOFCountryAllowedToSelect,
  setIsAllSelectionAllowedInCountry,
  setNoOFCitiesAllowedToSelect,
  setIsAllSelectionAllowedInCities,
  resetSelection,
  toggleBadgeModal,
  setBadgeType,
} = locationSlice.actions;

export default locationSlice.reducer;
