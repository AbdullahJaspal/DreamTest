import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomShareSheet from '../../../components/bottomSheets/CustomShareSheet';
import {useDispatch} from 'react-redux';
import {setSharePostRootId} from '../../../store/slices/content/pictureSlice';
import {useAppSelector} from '../../../store/hooks';
import {selectSharePostRootId} from '../../../store/selectors';

const ShareSheet: React.FC = () => {
  const dispatch = useDispatch();
  const sharePostRootId = useAppSelector(selectSharePostRootId);

  const [visible, setVisible] = useState<boolean>(false);

  function handleClose(): void {
    dispatch(setSharePostRootId(0));
  }

  function handleShare(): void {
    throw new Error('Function not implemented.');
  }

  const handleVisible = useCallback(() => {
    setVisible(sharePostRootId !== 0);
  }, [sharePostRootId]);

  useEffect(() => {
    handleVisible();
  }, [handleVisible]);

  return sharePostRootId !== 0 ? (
    <CustomShareSheet
      visible={visible}
      onClose={handleClose}
      onShare={handleShare}
    />
  ) : null;
};

export default ShareSheet;

const styles = StyleSheet.create({});
