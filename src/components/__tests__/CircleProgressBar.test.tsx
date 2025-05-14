import 'react-native';
import React from 'react';
import CircleProgressBar from '../CircleProgressBar';

import {it} from '@jest/globals';

import renderer from 'react-test-renderer';

it('CircleProgressBar renders correctly', () => {
  // Render the CText component
  const tree = renderer
    .create(
      <CircleProgressBar
        progress={0}
        radius={0}
        strokeWidth={0}></CircleProgressBar>,
    )
    .toJSON();

  // Compare the rendered output to the saved snapshot
  expect(tree).toMatchSnapshot();
});
