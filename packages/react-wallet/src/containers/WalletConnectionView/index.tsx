import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { WalletConnectionStep } from './types';
import { walletService } from '../../services';
import {
  ChainCodeResponse,
  FullWallet,
  hardwareWallets,
  isWeb3Wallet,
  ProviderType,
  Web3Wallet,
  web3Wallets,
} from '@sovryn/wallet';
import { ProviderTypeSelector } from '../../components/ProviderDialogSteps/ProviderTypeSelector';
import { BrowserWalletSelector } from '../../components/ProviderDialogSteps/BrowserWalletSelector';
import { BackButton } from '../../components/BackButton';
import { HardwareWalletSelector } from '../../components/ProviderDialogSteps/HardwareWalletSelector';
import { HardwarePathChooser } from '../../components/ProviderDialogSteps/HardwarePathChooser';
import { HardwareAddressSelector } from '../../components/ProviderDialogSteps/HardwareAddressSelector';
import { WalletConnectProviders } from '../../components/ProviderDialogSteps/WalletConnectProviders';
import { WalletContext } from '../../contexts/WalletContext';

export type WalletConnectionViewHwOptions = {
  chainId: number;
  dPath: string;
  seed?: string;
  chainCode?: string;
  publicKey?: string;
};

type WalletConnectionViewProps = {
  onStep: (value: WalletConnectionStep) => void;
  hwOptions: WalletConnectionViewHwOptions;
};

export const WalletConnectionView: React.FC<WalletConnectionViewProps> = (props) => {
  const context = useContext(WalletContext);
  const { t } = useTranslation();

  const [state, setState] = useState({
    step: WalletConnectionStep.NONE,
    showProviderList: false,
    showWalletList: false,
    loading: false,
  });

  useEffect(() => {
    if (state.showProviderList && state.step === WalletConnectionStep.NONE) {
      setState(prevState => ({
        ...prevState,
        step: WalletConnectionStep.PROVIDERS,
      }));
    }
  }, [context.connecting]);

  const onDismiss = React.useCallback(() => {
    setState(prevState => ({ ...prevState, step: WalletConnectionStep.NONE }));
    context.disconnect();
  }, [context]);


  const onProviderChosen = React.useCallback(async (provider: ProviderType) => {
    setState(prevState => ({ ...prevState, provider, loading: true }));
    context.state.loading.set(true);
    try {
      if (isWeb3Wallet(provider)) {
        context.unlockWeb3Wallet(provider, context.expectedChainId);
        const s = await walletService.start(provider);
        // @ts-ignore
        const w = await s.unlock(props.options?.chainId || props.chainId || 30);
        // @ts-ignore
        await setConnectedWallet(w);
        return;
      }

      if (hardwareWallets.includes(provider)) {
        setState(prevState => ({
          ...prevState,
          step: WalletConnectionStep.HARDWARE_PATH_SELECTOR,
        }));
        return;
      }

      // If there is no wallet, reset state.
      setState(prevState => ({
        ...prevState,
        provider: (null as unknown) as ProviderType,
        loading: false,
      }));
      context.state.loading.set(false);
    } catch (e) {
      setState(prevState => ({ ...prevState, loading: false }));
      context.state.loading.set(false);
    }
  }, []);

  // @ts-ignore
  const onChainCodeChanged = React.useCallback(
    (
      { chainCode, publicKey }: ChainCodeResponse,
      chainId: number,
      dPath: string,
    ) => {
      setState(prevState => ({
        ...prevState,
        dPath,
        chainId,
        chainCode,
        publicKey,
        step: WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR,
      }));
    },
    [context],
  );

  const onStepChange = useCallback((value: WalletConnectionStep) => {
    setState(prevState => ({ ...prevState, step: value }));
  }, []);

  return (
    <div>
      {[
        WalletConnectionStep.BROWSER_PROVIDERS,
        WalletConnectionStep.HARDWARE_PROVIDERS,
        WalletConnectionStep.HARDWARE_PATH_SELECTOR,
        WalletConnectionStep.WALLET_CONNECT_PROVIDERS,
      ].includes(props.step) && (
        <BackButton
          onClick={() => props.onStep(WalletConnectionStep.PROVIDERS)}
        />
      )}
      {props.step === WalletConnectionStep.PROVIDERS && (
        <ProviderTypeSelector onStep={props.onStep} />
      )}
      {props.step === WalletConnectionStep.BROWSER_PROVIDERS && (
        <BrowserWalletSelector onWalletSelected={props.onProviderChosen} />
      )}
      {props.step === WalletConnectionStep.HARDWARE_PROVIDERS && (
        <HardwareWalletSelector onWalletSelected={props.onProviderChosen} />
      )}
      {props.step === WalletConnectionStep.HARDWARE_PATH_SELECTOR && (
        <HardwarePathChooser
          provider={props.provider as ProviderType}
          chainId={props.chainId}
          onComplete={props.onChainCodeChanged}
        />
      )}
      {props.step === WalletConnectionStep.HARDWARE_ADDRESS_SELECTOR && (
        <HardwareAddressSelector
          chainId={props.hwOptions.chainId}
          dPath={props.hwOptions.dPath}
          seed={props.hwOptions.seed}
          chainCode={props.hwOptions.chainCode}
          publicKey={props.hwOptions.publicKey}
          onUnlock={props.onUnlockDeterministicWallet}
        />
      )}
      {props.step === WalletConnectionStep.WALLET_CONNECT_PROVIDERS && (
        <WalletConnectProviders
          onWalletSelected={props.onProviderChosen}
          uri={state.uri}
        />
      )}
    </div>
  );
};

export default WalletConnectionView;
