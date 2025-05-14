import 'react-native';
import React from 'react';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import PaymentSelectionHeader from '../PaymentSelectionHeader';

it('Icon renders correctly', () => {
  const tree = renderer.create(<PaymentSelectionHeader />).toJSON();

  expect(tree).toMatchSnapshot();
});
