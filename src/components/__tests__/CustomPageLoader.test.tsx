import 'react-native';
import React from 'react';
import CustomPageLoader from '../CustomPageLoader';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';

it('CustomPageLoader renders correctly', () => {
  // Render the CText component
  const tree = renderer
    .create(<CustomPageLoader isLoading={true}></CustomPageLoader>)
    .toJSON();

  // Compare the rendered output to the saved snapshot
  expect(tree).toMatchSnapshot();
});
