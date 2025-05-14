import 'react-native';
import React from 'react';
import Container from '../Container';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';

it('Container renders correctly', () => {
  // Render the CText component
  const tree = renderer.create(<Container></Container>).toJSON();

  // Compare the rendered output to the saved snapshot
  expect(tree).toMatchSnapshot();
});
