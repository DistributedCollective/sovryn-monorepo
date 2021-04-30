import {
  ChainCodeResponse,
  FullWallet,
  hardwareWallets,
  providerToWalletMap,
  ProviderType,
  Web3Wallet,
  web3Wallets,
} from '@sovryn/wallet';
import { translations } from '../../locales/i18n';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useWalletContext } from '../../hooks';
import { session, walletService } from '../../services';
import { base64Decode, base64Encode } from '../../services/helpers';
import { ProviderDialog } from '../ProviderDialog';
import { ProviderDialogStep } from '../ProviderDialog/types';

interface Options {
  // allow connection only to this chain id.
  chainId?: number;
  // use localstorage to remember to which wallet user was connected when user comes back.
  remember?: boolean;
  // show ribbon with alert when user connects to wrong network, used together with chainId.
  showWrongNetworkRibbon?: boolean;
  // language
  locale?: string;
}

interface Props {
  /** @deprecated use options instead */
  chainId?: number;
  /** @deprecated use options instead */
  remember?: boolean;
  options?: Options;
  children: React.ReactNode;
}

const REMEMBER_SESSION_KEY = '__sovryn_wallet';

export function WalletProvider(props: Props) {
  const walletRef = useRef(walletService);
  const wallet = walletRef.current;
  const context = useWalletContext();
  const { t } = useTranslation();

  useEffect(() => {
    context.state.wallet.set(wallet);
  }, [wallet]);

  useEffect(() => {
    i18next.changeLanguage(props.options?.locale || i18next.language);
  }, [props.options?.locale]);

  const [state, setState] = useState({
    step: ProviderDialogStep.NONE,
    chainId: props.options?.chainId || props.chainId || 30,
    provider: (null as unknown) as ProviderType,
    dPath: '',
    seed: '',
    chainCode: '',
    publicKey: '',
    uri: '',
    loading: false,
  });

  useEffect(() => {
    if (props.options?.chainId || props.chainId) {
      context.state.chainId.set(props.options?.chainId || props.chainId);
    }
  }, [props.options?.chainId, props.chainId, state.chainId]);

  useEffect(() => {
    if (
      context.state.showProviderList.value &&
      state.step === ProviderDialogStep.NONE
    ) {
      setState(prevState => ({
        ...prevState,
        step: ProviderDialogStep.PROVIDERS,
      }));
    }
  }, [context.loading]);

  const onDismiss = React.useCallback(() => {
    setState(prevState => ({ ...prevState, step: ProviderDialogStep.NONE }));
    context.disconnect();
  }, [context]);

  const setConnectedWallet = React.useCallback(
    async (wallet: FullWallet) => {
      await walletService.connect(wallet);
      setState(prevState => ({
        ...prevState,
        step: ProviderDialogStep.NONE,
        loading: false,
      }));
    },
    [context, props.options?.remember, props.remember, state],
  );

  const onProviderChosen = React.useCallback(async (provider: ProviderType) => {
    setState(prevState => ({ ...prevState, provider, loading: true }));
    context.state.loading.set(true);
    try {
      if (provider === ProviderType.WALLET_CONNECT) {
        const s = await walletService.start(provider);
        // @ts-ignore
        const uri = await s.unlock(
          props.options?.chainId || props.chainId || 30,
          async w => {
            await setConnectedWallet(w);
          },
        );
        // @ts-ignore
        setState(prevState => ({
          ...prevState,
          uri,
        }));
        return;
      }

      if (web3Wallets.includes(provider)) {
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
          step: ProviderDialogStep.HARDWARE_PATH_SELECTOR,
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
        step: ProviderDialogStep.HARDWARE_ADDRESS_SELECTOR,
      }));
    },
    [context],
  );

  const onUnlockDeterministicWallet = useCallback(
    async (
      address: string,
      index: number,
      providerType?: ProviderType,
      path?: string,
      chainId?: number,
    ) => {
      const provider = providerType || state.provider;
      const dPath = path || state.dPath;
      const chainID = chainId || state.chainId;
      if (hardwareWallets.includes(provider)) {
        const Wallet = providerToWalletMap[provider];
        // @ts-ignore
        await setConnectedWallet(new Wallet(address, dPath, index, chainID));
      }
    },
    [state],
  );

  const onStepChange = useCallback((value: ProviderDialogStep) => {
    setState(prevState => ({ ...prevState, step: value }));
  }, []);

  useEffect(() => {
    walletService.events.on('connected', (value: FullWallet) => {
      context.state.address.set(value.getAddressString());
      context.state.connected.set(true);
      context.state.loading.set(false);
      if (props.options?.remember || props.remember) {
        session.setItem(
          REMEMBER_SESSION_KEY,
          base64Encode(
            JSON.stringify({
              provider: value.getWalletType(),
              // @ts-ignore
              chainId: value?.chainId || state.chainId,
              data: hardwareWallets.includes(
                value.getWalletType() as ProviderType,
              )
                ? value
                : null,
            }),
          ),
        );
      }
    });

    walletService.events.on('disconnected', () => {
      context.state.address.set('');
      context.state.connected.set(false);
      context.state.loading.set(false);
      setState(prevState => ({
        ...prevState,
        provider: null as any,
        loading: false,
      }));
      session.removeItem(REMEMBER_SESSION_KEY);
    });
    return () => {};
  }, []);

  useEffect(() => {
    const wallet = walletService.wallet as Web3Wallet;

    if (
      wallet &&
      wallet?.provider &&
      [ProviderType.WEB3, ProviderType.WALLET_CONNECT].includes(
        wallet.getWalletType() as ProviderType,
      )
    ) {
      const p = wallet.provider;
      const providerType = wallet.getWalletType() as ProviderType;

      // @ts-ignore
      p.on('disconnect', value => {
        console.log('disconnect web3', value);
      });

      // @ts-ignore
      p.on('accountsChanged', async value => {
        console.log('account changed', value);
        await onProviderChosen(providerType);
      });

      // @ts-ignore
      p.on('chainChanged', async value => {
        await onProviderChosen(providerType);
        console.log('chain changed', Number(value));
      });
    }
    return () => {};
  }, [context.wallet.wallet?.getWalletType()]);

  useEffect(() => {
    try {
      const data = session.getItem(REMEMBER_SESSION_KEY);
      if (data) {
        const wallet = base64Decode(data) as any;
        const parsed = JSON.parse(wallet) as {
          provider: ProviderType;
          chainId: number;
          data: any;
        };

        if (parsed.provider === ProviderType.WALLET_CONNECT) {
          session.removeItem(REMEMBER_SESSION_KEY);
          session.removeItem('walletconnect');
          return;
        }

        if (web3Wallets.includes(parsed.provider)) {
          onProviderChosen(parsed.provider);
          return;
        }

        if (hardwareWallets.includes(parsed.provider)) {
          onUnlockDeterministicWallet(
            parsed.data.address,
            parsed.data.index,
            parsed.provider,
            parsed.data.dPath,
            parsed.chainId,
          );
        }

        session.removeItem(REMEMBER_SESSION_KEY);
      }
    } catch (e) {
      console.error(e);
      session.removeItem(REMEMBER_SESSION_KEY);
    }
  }, []);

  return (
    <React.Fragment>
      {props.options?.showWrongNetworkRibbon && props.options.chainId && (
        <React.Fragment>
          {[ProviderType.WALLET_CONNECT, ProviderType.WEB3].includes(
            context.wallet.providerType,
          ) && (
            <React.Fragment>
              {context.wallet.wallet?.chainId !== props.options.chainId &&
                t(translations.common.alert)}
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      <React.Fragment>{props.children}</React.Fragment>

      <React.Fragment>
        <ProviderDialog
          step={state.step}
          onClose={onDismiss}
          onStep={onStepChange}
          provider={state.provider}
          uri={state.uri}
          chainId={props.options?.chainId || props.chainId}
          onProviderChosen={onProviderChosen}
          onChainCodeChanged={onChainCodeChanged}
          onUnlockDeterministicWallet={onUnlockDeterministicWallet}
          hwOptions={{
            chainId: state.chainId,
            dPath: state.dPath,
            seed: state.seed,
            chainCode: state.chainCode,
            publicKey: state.publicKey,
          }}
        />
      </React.Fragment>
    </React.Fragment>
  );
}
