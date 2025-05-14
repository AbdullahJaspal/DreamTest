import React from 'react';

import ModalSignIn from '../components/modal/ModalSignIn';
import RechargeBottomSheet from '../components/bottomSheets/RechargeBottomSheet';
import PaymentsGatewaySelection from '../components/bottomSheets/PaymentsGatewaySelection';
import BadgeInformation from '../components/modal/BadgeInformation';
import BoxGiftMainModel from '../components/BoxGift/BoxGiftMainModel';

import ShareSheet from './home/components/ShareSheet';
import BlockUser from './home/components/BlockUser';

import {setRechargeSheet} from '../store/slices/ui/indexSlice';

const Index: React.FC = () => {
  return (
    <>
      <ModalSignIn />
      {setRechargeSheet === true && <RechargeBottomSheet />}
      <PaymentsGatewaySelection />
      <BoxGiftMainModel />
      <ShareSheet />
      <BadgeInformation />
      <BlockUser />
    </>
  );
};

export default React.memo(Index);
