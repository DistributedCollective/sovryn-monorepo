import {
  FullWallet,
  hardwareWallets,
  isHardwareWallet,
  isWeb3Wallet,
  PortisWallet,
  providerToWalletMap,
  ProviderType,
  WalletConnectWallet,
  walletProviderMap,
  Web3Wallet,
} from '@sovryn/wallet';
import { translations } from '../../locales/i18n';
import * as React from 'react';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { session, walletService } from '../../services';
import { base64Decode, base64Encode } from '../../services/helpers';
import {
  WalletContextFunctionsType,
  WalletContextStateType,
  WalletContext,
  WalletContextType,
} from '../../contexts/WalletContext';
import { useTranslation } from 'react-i18next';
import Portal from '../../components/Portal';
import i18next from 'i18next';
import { IpcProvider } from 'web3-core';

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
  options?: Options;
  portalTargetId?: string;
  children: React.ReactNode;
}

const REMEMBER_SESSION_KEY = '__sovryn_wallet';

export function WalletProvider(props: Props) {
  const { t } = useTranslation();

  const { chainId: expectedChainId = 30 } = props.options || {};

  const [state, setState] = useState<WalletContextStateType>({
    walletService: walletService,
    expectedChainId: expectedChainId,
    chainId: undefined,
    address: undefined,
    provider: undefined,
    dPath: undefined,
    seed: undefined,
    chainCode: undefined,
    publicKey: undefined,
    uri: undefined,
    connected: false,
    connecting: false,
  });

  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const startConnectionDialog = useCallback(() => {
    setShowConnectionDialog(true);
    setState({ ...state, connecting: true });
    walletService.events.trigger('connect');
  }, [state, setState]);

  const disconnect = useCallback(() => {
    setState({
      ...state,
      address: undefined,
      provider: undefined,
      dPath: undefined,
      seed: undefined,
      chainCode: undefined,
      publicKey: undefined,
      uri: undefined,
      connected: false,
      connecting: false,
    });
    walletService.disconnect();
  }, [state, setState]);

  const setConnectedWallet = useCallback(async (wallet: FullWallet) => {
    await walletService.connect(wallet);
    return true;
  }, []);

  const unlockDeterministicWallet: WalletContextFunctionsType['unlockDeterministicWallet'] = useCallback(
    async (
      address: string,
      index: number,
      provider: ProviderType,
      path?: string,
      chainId?: number,
    ) => {
      if (provider && isHardwareWallet(provider)) {
        const Wallet = providerToWalletMap[provider];
        return await setConnectedWallet(
          new Wallet(address, path || '', index, chainId),
        );
      }
      return false;
    },
    [],
  );

  const unlockWeb3Wallet: WalletContextFunctionsType['unlockWeb3Wallet'] = useCallback(
    async (provider: ProviderType, chainId: number) => {
      if (provider && isWeb3Wallet(provider)) {
        const ProviderClass = walletProviderMap[provider];
        const providerInstance = new ProviderClass(walletService);
        const wallet = await providerInstance.unlock(chainId);
        return await setConnectedWallet(wallet);
      }
      return false;
    },
    [],
  );

  useEffect(() => {
    i18next.changeLanguage(props.options?.locale || i18next.language);
  }, [props.options?.locale]);

  useEffect(() => {
    setState({
      ...state,
      walletService: walletService,
    });
  }, [walletService]);

  useEffect(() => {
    if (state.expectedChainId !== expectedChainId) {
      setState({
        ...state,
        expectedChainId: expectedChainId,
      });
    }
  }, [state, setState, expectedChainId]);

  // handle walletService events
  useEffect(() => {
    const onConnect = (value: FullWallet) => {
      setState({
        ...state,
        address: value.getAddressString(),
        chainId: value.chainId,
        provider: value.getWalletType() as ProviderType,
        uri: value instanceof WalletConnectWallet ? value.uri : undefined,
        connected: true,
        connecting: false,
      });

      if (props.options?.remember) {
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
    };
    walletService.events.on('connected', onConnect);

    const onDisconnect = () => {
      setState({
        ...state,
        address: undefined,
        provider: undefined,
        dPath: undefined,
        seed: undefined,
        chainCode: undefined,
        publicKey: undefined,
        uri: undefined,
        connected: false,
        connecting: false,
      });
      session.removeItem(REMEMBER_SESSION_KEY);
    };
    walletService.events.on('disconnected', onDisconnect);
    return () => {
      walletService.events.off('connect', onConnect);
      walletService.events.off('disconnected', onDisconnect);
    };
  }, [state, setState]);

  // handle walletProvider events
  useEffect(() => {
    const wallet = walletService.wallet;
    const providerType = wallet.getWalletType() as ProviderType;

    if (
      wallet &&
      providerType &&
      [ProviderType.WEB3, ProviderType.WALLET_CONNECT].includes(providerType)
    ) {
      const p = (wallet as Web3Wallet | WalletConnectWallet).provider;
      if (p && typeof p === 'object' && 'on' in p) {
        const onDisconnect = (...args: any[]) => {
          console.log('disconnect web3', args);
        };

        const onAccountChanged = async (...args: any[]) => {
          console.log('account changed', args);
          await onProviderChosen(providerType);
        };

        const onChainChanged = async (...args: any[]) => {
          await onProviderChosen(providerType);
          console.log('chain changed', Number(args[0]), args);
        };

        p.on('disconnect', onDisconnect);
        p.on('accountsChanged', onAccountChanged);
        p.on('chainChanged', onChainChanged);

        return () => {
          p.removeListener('disconnect', onDisconnect);
          p.removeListener('accountsChanged', onAccountChanged);
          p.removeListener('chainChanged', onChainChanged);
        };
      }
    }
    return () => {};
  }, [walletService.wallet?.getWalletType()]);

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

        if (isWeb3Wallet(parsed.provider)) {
          unlockWeb3Wallet(parsed.provider, parsed.chainId);
          return;
        }

        if (isHardwareWallet(parsed.provider)) {
          unlockDeterministicWallet(
            parsed.data.address,
            parsed.data.index,
            parsed.provider,
            parsed.data.dPath,
            parsed.chainId,
          );
          return;
        }

        session.removeItem(REMEMBER_SESSION_KEY);
      }
    } catch (e) {
      console.error(e);
      session.removeItem(REMEMBER_SESSION_KEY);
    }
  }, []);

  const showWrongNetworkAlert =
    props.options?.showWrongNetworkRibbon &&
    state.connected &&
    props.options.chainId &&
    props.options.chainId !== state.chainId &&
    state.provider &&
    [ProviderType.WALLET_CONNECT, ProviderType.WEB3].includes(state.provider);

  const contextValue: WalletContextType = useMemo(
    () => ({
      ...state,
      set: setState,
      disconnect,
      startConnectionDialog,
      setConnectedWallet,
      unlockDeterministicWallet,
      unlockWeb3Wallet,
    }),
    [
      state,
      setState,
      disconnect,
      startConnectionDialog,
      setConnectedWallet,
      unlockDeterministicWallet,
      unlockWeb3Wallet,
    ],
  );

  let connectionDialog = null;
  if (showConnectionDialog) {
    let dialog = <WalletConnectionDialog />;
    if (props.portalTargetId) {
      connectionDialog = (
        <Portal parentId={props.portalTargetId}>{dialog}</Portal>
      );
    } else {
      connectionDialog = dialog;
    }
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {showWrongNetworkAlert && (
        <React.Fragment>{t(translations.common.alert)}</React.Fragment>
      )}

      <React.Fragment>{props.children}</React.Fragment>

      {}
    </WalletContext.Provider>
  );
}
