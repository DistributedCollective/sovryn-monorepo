import * as React from 'react';
import { useMemo } from 'react';
import { Dialog } from '../../components/Dialog';
import { WalletConnectionStep } from '../WalletConnectionView/types';
import { WalletConnectionView, WalletConnectionViewHwOptions } from '../WalletConnectionView';

type WalletConnectionDialogProps = {
  onClose: () => void;
  onUnlockDeterministicWallet: (address: string, index: number) => void;
  hwOptions: WalletConnectionViewHwOptions;
};

export function WalletConnectionDialog(props: WalletConnectionDialogProps) {
  const size = useMemo(() => {
    switch (props.step) {
      default:
        return 'large';
      case WalletConnectionStep.HARDWARE_PATH_SELECTOR:
        return 'small';
      case WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR:
        return 'large';
    }
  }, [props.step]);
  return (
    <Dialog
      onClose={props.onClose}
      isOpen={props.step !== WalletConnectionStep.NONE}
      size={size}
    >
      <WalletConnectionView />
    </Dialog>
  );
}
