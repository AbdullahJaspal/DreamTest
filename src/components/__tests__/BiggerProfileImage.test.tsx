import 'react-native';
import React from 'react';

import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import BiggerProfileImage from '../BiggerProfileImage';
import {TESTING_PIC_URL} from '../../constants/constants';

it('Container renders correctly', () => {
  // Render the CText component
  const tree = renderer
    .create(
      <BiggerProfileImage
        uri={TESTING_PIC_URL}
        width={0}
        height={0}
        onPress={function (): void {
          console.log('Bigger Profile click');
        }}
        containerStyle={undefined}
        pictureStyle={undefined}
        coverStyle={undefined}></BiggerProfileImage>,
    )
    .toJSON();

  // Compare the rendered output to the saved snapshot
  expect(tree).toMatchSnapshot();
});
