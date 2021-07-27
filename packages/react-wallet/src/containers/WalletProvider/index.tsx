import {
  FullWallet,
  hardwareWallets,
  isHardwareWallet,
  isWeb3Wallet,
  providerToWalletMap,
  ProviderType,
  WalletConnectWallet,
  walletProviderMap,
  Web3Wallet,
} from '@sovryn/wallet';
import { translations } from '../../locales/i18n';
import * as React from 'react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { session, walletService } from '../../services';
import { base64Decode, base64Encode } from '../../services/helpers';
import {
  WalletContextFunctionsType,
  WalletContextStateType,
  WalletContext,
  WalletContextType,
} from '../../contexts/WalletContext';
import { WalletConnectionDialog } from '../../components/WalletConnectionDialog';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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

  const { chainId: expectedChainId } = props.options || {};

  const [state, setState] = useState<WalletContextStateType>({
    wallet: walletService,
    expectedChainId: expectedChainId,
    chainId: undefined,
    address: undefined,
    hwIndex: undefined,
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

  const connect = useCallback(() => {
    setShowConnectionDialog(true);
    setState(state => ({ ...state, connecting: true }));
    walletService.events.trigger('connect');
  }, [setState]);

  const onCloseConnectionDialog = useCallback(() => {
    setShowConnectionDialog(false);
    setState(state => ({ ...state, connecting: false }));
  }, [setShowConnectionDialog, setState]);

  const disconnect = useCallback(() => {
    setState(state => ({
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
    }));
    walletService.disconnect();
  }, [setState, walletService]);

  const setConnectedWallet = useCallback(
    async (wallet: FullWallet) => {
      await walletService.connect(wallet);
      return true;
    },
    [walletService],
  );

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
    [setConnectedWallet],
  );

  const unlockWeb3Wallet: WalletContextFunctionsType['unlockWeb3Wallet'] = useCallback(
    async (provider: ProviderType, chainId: number) => {
      if (provider && isWeb3Wallet(provider)) {
        const ProviderClass = walletProviderMap[provider];
        const providerInstance = new ProviderClass(walletService);
        const wallet = await providerInstance.unlock(chainId, (uri: string) => {
          if (uri === undefined || typeof uri === 'string') {
            setState(state => ({ ...state, uri }));
          }
        });
        return await setConnectedWallet(wallet);
      }
      return false;
    },
    [setState, setConnectedWallet],
  );

  const reconnect: WalletContextFunctionsType['reconnect'] = useCallback(async () => {
    const {
      provider,
      chainId,
      expectedChainId,
      address,
      hwIndex,
      dPath,
    } = state;
    if (provider) {
      if (isWeb3Wallet(provider)) {
        const activeChainId = chainId || expectedChainId;
        return await unlockWeb3Wallet(provider, activeChainId);
      } else if (
        address != null &&
        hwIndex != null &&
        isHardwareWallet(provider)
      ) {
        const {} = state;
        const activeChainId = chainId || expectedChainId;
        return await unlockDeterministicWallet(
          address,
          hwIndex,
          provider,
          dPath,
          activeChainId,
        );
      }
    }
    return false;
  }, [state, unlockDeterministicWallet, unlockWeb3Wallet]);

  useEffect(() => {
    i18next.changeLanguage(props.options?.locale || i18next.language);
  }, [props.options?.locale]);

  useEffect(() => {
    setState({
      ...state,
      wallet: walletService,
    });
  }, [walletService, setState]);

  useEffect(() => {
    if (state.expectedChainId !== expectedChainId) {
      setState(state => ({
        ...state,
        expectedChainId: expectedChainId,
      }));
    }
  }, [state?.expectedChainId, expectedChainId, setState]);

  // handle walletService events
  useEffect(() => {
    const onConnect = (value: FullWallet) => {
      setState({
        ...state,
        address: value.getAddressString(),
        chainId: value.chainId,
        provider: value.getWalletType() as ProviderType,
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
    const providerType = wallet && (wallet.getWalletType() as ProviderType);

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
          await reconnect();
        };

        const onChainChanged = async (...args: any[]) => {
          console.log('chain changed', Number(args[0]), args);
          await reconnect();
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
      connect,
      disconnect,
      reconnect,
      setConnectedWallet,
      unlockDeterministicWallet,
      unlockWeb3Wallet,
    }),
    [
      state,
      setState,
      connect,
      reconnect,
      disconnect,
      setConnectedWallet,
      unlockDeterministicWallet,
      unlockWeb3Wallet,
    ],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {showWrongNetworkAlert && (
        <React.Fragment>{t(translations.common.alert)}</React.Fragment>
      )}
      <React.Fragment>{props.children}</React.Fragment>
      {showConnectionDialog && (
        <WalletConnectionDialog
          portalTargetId={props.portalTargetId}
          isOpen={showConnectionDialog}
          onClose={onCloseConnectionDialog}
        />
      )}
    </WalletContext.Provider>
  );
}
