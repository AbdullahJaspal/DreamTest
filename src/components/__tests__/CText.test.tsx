import 'react-native';
import React from 'react';
import CText from '../CText';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';

it('CText renders correctly', () => {
  // Render the CText component
  const tree = renderer.create(<CText>Test</CText>).toJSON();

  // Compare the rendered output to the saved snapshot
  expect(tree).toMatchSnapshot();
});
