import 'react-native';
import React from 'react';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import CButton from '../CButton';

it('Icon renders correctly', () => {
  const tree = renderer.create(<CButton></CButton>).toJSON();

  expect(tree).toMatchSnapshot();
});
