import * as React from 'react';
import { useMemo } from 'react';
import { ProviderType, ChainCodeResponse } from '@sovryn/wallet';
import { Dialog } from '../../components/Dialog';
import { ProviderTypeSelector } from '../../components/ProviderDialogSteps/ProviderTypeSelector';
import { BrowserWalletSelector } from '../../components/ProviderDialogSteps/BrowserWalletSelector';
import { ProviderDialogStep } from './types';
import { BackButton } from '../../components/BackButton';
import { HardwareWalletSelector } from '../../components/ProviderDialogSteps/HardwareWalletSelector';
import { HardwarePathChooser } from '../../components/ProviderDialogSteps/HardwarePathChooser';
import { HardwareAddressSelector } from '../../components/ProviderDialogSteps/HardwareAddressSelector';
import { WalletConnectProviders } from '../../components/ProviderDialogSteps/WalletConnectProviders';

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
  uri?: string;
}

export function ProviderDialog(props: Props) {
  const size = useMemo(() => {
    switch (props.step) {
      default:
        return 'large';
      case ProviderDialogStep.HARDWARE_PATH_SELECTOR:
        return 'small';
      case ProviderDialogStep.HARDWARE_ADDRESS_SELECTOR:
        return 'large';
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
        ProviderDialogStep.HARDWARE_PATH_SELECTOR,
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
        <WalletConnectProviders
          onWalletSelected={props.onProviderChosen}
          uri={props.uri}
        />
      )}
    </Dialog>
  );
}
