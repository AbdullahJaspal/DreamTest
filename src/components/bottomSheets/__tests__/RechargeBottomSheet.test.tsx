import React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import RechargeBottomSheet from '../RechargeBottomSheet';
import configureStore from 'redux-mock-store';
import {useAppSelector} from '../../../store/hooks';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useAppSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {changeLanguage: () => new Promise(() => {})},
  }),
}));

describe('RechargeBottomSheet', () => {
  const mockStore = configureStore([]);
  let store: any;

  beforeEach(() => {
    store = mockStore({
      index: {
        rechargeSheet: true,
      },
      my_data: {
        my_profile_data: {
          wallet: 1000,
        },
      },
    });

    (useAppSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector(store.getState()),
    );
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <RechargeBottomSheet />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
