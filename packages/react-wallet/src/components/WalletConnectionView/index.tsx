import React, { useEffect, useState, useCallback, useContext } from 'react';
import { WalletConnectionStep } from './types';
import {
  ChainCodeResponse,
  isHardwareWallet,
  isWeb3Wallet,
  ProviderType,
} from '@sovryn/wallet';
import { ProviderTypeSelector } from '../WalletConnectionSteps/ProviderTypeSelector';
import { BrowserWalletSelector } from '../WalletConnectionSteps/BrowserWalletSelector';
import { BackButton } from '../BackButton';
import { HardwareWalletSelector } from '../WalletConnectionSteps/HardwareWalletSelector';
import { HardwarePathChooser } from '../WalletConnectionSteps/HardwarePathChooser';
import { HardwareAddressSelector } from '../WalletConnectionSteps/HardwareAddressSelector';
import { DEFAULT_CHAIN_ID, WalletContext } from '../../contexts';
import { SoftwareWalletSelector } from '../WalletConnectionSteps/SoftwareWalletSelector';

export type WalletConnectionViewHwOptions = {
  chainId: number;
  dPath: string;
  seed?: string;
  chainCode?: string;
  publicKey?: string;
};

type WalletConnectionViewProps = {
  onStep: (value: WalletConnectionStep) => void;
  onCompleted: (result: boolean) => void;
  hideInstructionLink?: boolean;
  enableSoftwareWallet?: boolean;
};

type WalletConnectionViewState = {
  step: WalletConnectionStep;
  showProviderList: boolean;
  showWalletList: boolean;
  provider?: ProviderType;
  hwOptions?: WalletConnectionViewHwOptions;
};

export const WalletConnectionView: React.FC<WalletConnectionViewProps> = props => {
  const context = useContext(WalletContext);

  const [state, setState] = useState<WalletConnectionViewState>({
    step: WalletConnectionStep.NONE,
    showProviderList: true,
    showWalletList: false,
    provider: undefined,
  });

  useEffect(() => {
    if (state.showProviderList && state.step === WalletConnectionStep.NONE) {
      onStepChange(WalletConnectionStep.PROVIDERS);
    }
  }, [state.showProviderList, state.step]);

  const onProviderChosen = React.useCallback(
    async (provider: ProviderType) => {
      setState(prevState => ({ ...prevState, provider }));
      try {
        if (isWeb3Wallet(provider)) {
          const result = await context.unlockWeb3Wallet(
            provider,
            context.expectedChainId,
          );
          if (props.onCompleted) {
            props.onCompleted(result);
          }
          return;
        } else if (isHardwareWallet(provider)) {
          onStepChange(WalletConnectionStep.HARDWARE_PATH_SELECTOR);
        } else {
          setState(prevState => ({
            ...prevState,
            provider: undefined,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [context],
  );

  const onChainCodeChanged = React.useCallback(
    (
      { chainCode, publicKey }: ChainCodeResponse,
      chainId: number,
      dPath: string,
    ) => {
      setState(prevState => ({
        ...prevState,
        hwOptions: {
          dPath,
          chainId,
          chainCode,
          publicKey,
        },
      }));
      onStepChange(WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR);
    },
    [context],
  );

  const onStepChange = useCallback((value: WalletConnectionStep) => {
    setState(prevState => ({ ...prevState, step: value }));
    if (props.onStep) {
      props.onStep(value);
    }
  }, []);

  const onUnlockDeterministicWallet = useCallback(
    async (address: string, index: number) => {
      if (state.provider && context.unlockDeterministicWallet) {
        let result = false;
        try {
          result = await context.unlockDeterministicWallet(
            address,
            index,
            state.provider,
            state.hwOptions?.dPath,
            state.hwOptions?.chainId,
          );
        } catch (e) {
          console.error(e);
        }
        if (props.onCompleted) {
          props.onCompleted(result);
        }
      }
    },
    [state, context.unlockDeterministicWallet],
  );

  const onUnlockSoftwareWallet = useCallback(
    async (provider: ProviderType, secret: string) => {
      setState(prevState => ({ ...prevState, provider }));
      if (provider && context.unlockSoftwareWallet) {
        let result = false;
        try {
          result = await context.unlockSoftwareWallet(provider, secret);
        } catch (e) {
          console.error(e);
        }
        if (props.onCompleted) {
          props.onCompleted(result);
        }
      }
    },
    [context.unlockDeterministicWallet],
  );

  return (
    <div>
      {[
        WalletConnectionStep.BROWSER_PROVIDERS,
        WalletConnectionStep.HARDWARE_PROVIDERS,
        WalletConnectionStep.HARDWARE_PATH_SELECTOR,
        WalletConnectionStep.SOFTWARE_PROVIDERS,
      ].includes(state.step) && (
        <BackButton
          onClick={() => onStepChange(WalletConnectionStep.PROVIDERS)}
        />
      )}
      {state.step === WalletConnectionStep.PROVIDERS && (
        <ProviderTypeSelector
          onStep={onStepChange}
          hideInstructionLink={props.hideInstructionLink}
          enableSoftwareWallet={props.enableSoftwareWallet}
        />
      )}
      {state.step === WalletConnectionStep.BROWSER_PROVIDERS && (
        <BrowserWalletSelector
          onWalletSelected={onProviderChosen}
          hideInstructionLink={props.hideInstructionLink}
        />
      )}
      {state.step === WalletConnectionStep.HARDWARE_PROVIDERS && (
        <HardwareWalletSelector
          onWalletSelected={onProviderChosen}
          hideInstructionLink={props.hideInstructionLink}
        />
      )}
      {state.step === WalletConnectionStep.HARDWARE_PATH_SELECTOR && (
        <HardwarePathChooser
          provider={state.provider as ProviderType}
          chainId={state.hwOptions?.chainId || context.expectedChainId}
          onComplete={onChainCodeChanged}
          hideInstructionLink={props.hideInstructionLink}
        />
      )}
      {state.step === WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR && (
        <HardwareAddressSelector
          chainId={
            state.hwOptions?.chainId ||
            context.expectedChainId ||
            DEFAULT_CHAIN_ID
          }
          dPath={state.hwOptions?.dPath || ''}
          seed={state.hwOptions?.seed}
          chainCode={state.hwOptions?.chainCode}
          publicKey={state.hwOptions?.publicKey}
          onUnlock={onUnlockDeterministicWallet}
        />
      )}
      {state.step === WalletConnectionStep.SOFTWARE_PROVIDERS && (
        <SoftwareWalletSelector
          onWalletSelected={onUnlockSoftwareWallet}
          hideInstructionLink={props.hideInstructionLink}
        />
      )}
    </div>
  );
};

export default WalletConnectionView;
