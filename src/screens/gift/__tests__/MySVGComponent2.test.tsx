import 'react-native';
import React from 'react';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import MySVGComponent from '../components/SvgImage2';

it('Icon renders correctly', () => {
  const tree = renderer
    .create(<MySVGComponent text={'hello'}></MySVGComponent>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
