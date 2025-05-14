import 'react-native';
import React from 'react';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import Icon from '../Icon';
import {TESTING_PIC_URL} from '../../constants/constants';

it('Icon renders correctly', () => {
  const tree = renderer
    .create(<Icon source={{uri: TESTING_PIC_URL}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
