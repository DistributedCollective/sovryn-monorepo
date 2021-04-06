import * as React from 'react';
import { useMemo } from 'react';
import { ProviderType, ChainCodeResponse } from '@sovryn/wallet';
import { Dialog } from '../../components/Dialog';
import { ProviderTypeSelector } from '../../components/steps/ProviderTypeSelector';
import { BrowserWalletSelector } from '../../components/steps/BrowserWalletSelector';
import { ProviderDialogStep } from './types';
import { BackButton } from '../../components/BackButton';
import { HardwareWalletSelector } from '../../components/steps/HardwareWalletSelector';
import { HardwarePathChooser } from '../../components/steps/HardwarePathChooser';
import { HardwareAddressSelector } from '../../components/steps/HardwareAddressSelector';

interface HwOptions {
  chainId: number;
  dPath: string;
  seed?: string;
  chainCode?: string;
  publicKey?: string;
}

interface Props {
  step: ProviderDialogStep;
  provider?: ProviderType;
  chainId?: number;
  onClose: () => void;
  onStep: (value: ProviderDialogStep) => void;
  onProviderChosen: (provider: ProviderType) => void;
  onChainCodeChanged: (
    { chainCode, publicKey }: ChainCodeResponse,
    chainId: number,
    dPath: string,
  ) => void;
  onUnlockDeterministicWallet: (address: string, index: number) => void;
  hwOptions: HwOptions;
}

export function ProviderDialog(props: Props) {
  const size = useMemo(() => {
    switch (props.step) {
      default:
        return 'large';
      case ProviderDialogStep.HARDWARE_PATH_SELECTOR:
      case ProviderDialogStep.HARDWARE_ADDRESS_SELECTOR:
        return 'small';
    }
  }, [props.step]);
  return (
    <Dialog
      onClose={props.onClose}
      isOpen={props.step !== ProviderDialogStep.NONE}
      size={size}
    >
      {[
        ProviderDialogStep.BROWSER_PROVIDERS,
        ProviderDialogStep.HARDWARE_PROVIDERS,
        ProviderDialogStep.WALLET_CONNECT_PROVIDERS,
      ].includes(props.step) && (
        <BackButton
          onClick={() => props.onStep(ProviderDialogStep.PROVIDERS)}
        />
      )}
      {props.step === ProviderDialogStep.PROVIDERS && (
        <ProviderTypeSelector onStep={props.onStep} />
      )}
      {props.step === ProviderDialogStep.BROWSER_PROVIDERS && (
        <BrowserWalletSelector onWalletSelected={props.onProviderChosen} />
      )}
      {props.step === ProviderDialogStep.HARDWARE_PROVIDERS && (
        <HardwareWalletSelector onWalletSelected={props.onProviderChosen} />
      )}
      {props.step === ProviderDialogStep.HARDWARE_PATH_SELECTOR && (
        <HardwarePathChooser
          provider={props.provider as ProviderType}
          chainId={props.chainId}
          onComplete={props.onChainCodeChanged}
        />
      )}
      {props.step === ProviderDialogStep.HARDWARE_ADDRESS_SELECTOR && (
        <HardwareAddressSelector
          chainId={props.hwOptions.chainId}
          dPath={props.hwOptions.dPath}
          seed={props.hwOptions.seed}
          chainCode={props.hwOptions.chainCode}
          publicKey={props.hwOptions.publicKey}
          onUnlock={props.onUnlockDeterministicWallet}
        />
      )}
      {props.step === ProviderDialogStep.WALLET_CONNECT_PROVIDERS && (
        <BrowserWalletSelector onWalletSelected={props.onProviderChosen} />
      )}
    </Dialog>
  );
}
