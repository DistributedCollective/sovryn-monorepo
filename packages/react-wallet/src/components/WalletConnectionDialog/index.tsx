import React, { useState } from 'react';
import { useMemo } from 'react';
import { Dialog } from '../../containers/Dialog';
import { WalletConnectionStep } from '../WalletConnectionView/types';
import {
  WalletConnectionView,
} from '../WalletConnectionView';

type WalletConnectionDialogProps = {
  onClose: () => void;
};

export function WalletConnectionDialog({onClose}: WalletConnectionDialogProps) {
  const [step, setStep] = useState<WalletConnectionStep>(WalletConnectionStep.NONE);
  const size = useMemo(() => {
    switch (step) {
      default:
        return 'large';
      case WalletConnectionStep.HARDWARE_PATH_SELECTOR:
        return 'small';
      case WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR:
        return 'large';
    }
  }, [step]);

  return (
    <Dialog
      onClose={onClose}
      size={size}
      isOpen
    >
      <WalletConnectionView onStep={setStep} onCompleted={onClose}/>
    </Dialog>
  );
}
