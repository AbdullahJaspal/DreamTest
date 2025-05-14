import React from 'react';
import Container from './Container';
import Icon from './Icon';
import {gifs} from '../assets/gifs';

const Loading = () => {
  return (
    <Container
      width={'100%'}
      height={'100%'}
      justifyContent="center"
      alignItems="center">
      <Icon source={gifs.tiktokLoader} width={50} height={50} />
    </Container>
  );
};

export default Loading;
