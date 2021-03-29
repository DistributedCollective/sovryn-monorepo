import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChainCodeResponse,
  FullWallet,
  hardwareWallets,
  providerToWalletMap,
  ProviderType,
  Web3Wallet,
  web3Wallets,
} from '@sovryn/wallet';
import { useWalletContext } from '../hooks';
import { session, walletService } from '../services';
import { ProviderList } from '../components/steps/ProviderList';
import { DeterministicWallets } from '../components/steps/DeterministicWallets';
import { HardwarePathChooser } from '../components/steps/HardwarePathChooser';
import { base64Decode, base64Encode } from '../services/helpers';

interface Props {
  chainId?: number;
  remember?: boolean;
  children: React.ReactNode;
}

enum DialogType {
  NONE,
  PROVIDER_LIST,
  HD_PATH_CHOSER,
  DETERMINISTIC_WALLET_LIST,
}

export function WalletProvider(props: Props) {
  const walletRef = useRef(walletService);
  const wallet = walletRef.current;
  const context = useWalletContext();

  useEffect(() => {
    context.state.wallet.set(wallet);
  }, [wallet]);

  const [state, setState] = useState({
    step: DialogType.NONE,
    chainId: props.chainId || 30,
    provider: (null as unknown) as ProviderType,
    dPath: '',
    seed: '',
    chainCode: '',
    publicKey: '',
    loading: false,
  });

  useEffect(() => {
    if (props.chainId) {
      context.state.chainId.set(props.chainId);
    }
  }, [props.chainId, state.chainId]);

  useEffect(() => {
    if (
      context.state.showProviderList.value &&
      state.step === DialogType.NONE
    ) {
      setState(prevState => ({ ...prevState, step: DialogType.PROVIDER_LIST }));
    }
  }, [context.loading]);

  const onDismiss = React.useCallback(() => {
    setState(prevState => ({ ...prevState, step: DialogType.NONE }));
    context.disconnect();
  }, [context]);

  const setConnectedWallet = React.useCallback(
    async (wallet: FullWallet) => {
      await walletService.connect(wallet);
      setState(prevState => ({
        ...prevState,
        step: DialogType.NONE,
        loading: false,
      }));
    },
    [context, props.remember, state],
  );

  const onProviderChosen = React.useCallback(async (provider: ProviderType) => {
    setState(prevState => ({ ...prevState, provider, loading: true }));
    context.state.loading.set(true);
    try {
      if (web3Wallets.includes(provider)) {
        const s = await walletService.start(provider);
        // @ts-ignore
        const w = await s.unlock(props.chainId || 30);
        await setConnectedWallet(w);
        return;
      }

      if (hardwareWallets.includes(provider)) {
        setState(prevState => ({
          ...prevState,
          step: DialogType.HD_PATH_CHOSER,
        }));
        return;
      }

      setState(prevState => ({
        ...prevState,
        provider: (null as unknown) as ProviderType,
        loading: false,
      }));
      context.state.loading.set(false);
    } catch (e) {
      console.error(e);
      setState(prevState => ({ ...prevState, loading: false }));
      context.state.loading.set(false);
    }
  }, []);

  /**
   * Ledger
   * */
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
        step: DialogType.DETERMINISTIC_WALLET_LIST,
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

  useEffect(() => {
    walletService.events.on('connected', (value: FullWallet) => {
      context.state.address.set(value.getAddressString());
      context.state.connected.set(true);
      context.state.loading.set(false);

      if (props.remember) {
        session.setItem(
          '__sovryn_wallet',
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
      session.removeItem('__sovryn_wallet');
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
      const data = session.getItem('__sovryn_wallet');
      if (data) {
        const wallet = base64Decode(data) as any;
        const parsed = JSON.parse(wallet) as {
          provider: ProviderType;
          chainId: number;
          data: any;
        };
        if (web3Wallets.includes(parsed.provider)) {
          onProviderChosen(parsed.provider);
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
      }
    } catch (e) {
      console.error(e);
      session.removeItem('__sovryn_wallet');
    }
  }, []);

  return (
    <React.Fragment>
      {[ProviderType.WALLET_CONNECT, ProviderType.WEB3].includes(
        context.wallet.providerType,
      ) && (
        <React.Fragment>
          {!!props.chainId &&
            context.wallet.wallet?.chainId !== props.chainId &&
            'You are connected to wrong network.'}
        </React.Fragment>
      )}

      <div>{props.children}</div>

      <React.Fragment>
        <ProviderList
          isOpen={state.step === DialogType.PROVIDER_LIST}
          loading={state.loading}
          onClose={onDismiss}
          onProvider={onProviderChosen}
        />
        <HardwarePathChooser
          provider={state.provider}
          chainId={props.chainId}
          isOpen={state.step === DialogType.HD_PATH_CHOSER}
          onClose={onDismiss}
          onComplete={onChainCodeChanged}
        />
        <DeterministicWallets
          isOpen={state.step === DialogType.DETERMINISTIC_WALLET_LIST}
          onClose={onDismiss}
          chainId={state.chainId}
          dPath={state.dPath}
          seed={state.seed}
          chainCode={state.chainCode}
          publicKey={state.publicKey}
          onUnlock={onUnlockDeterministicWallet}
        />
      </React.Fragment>
    </React.Fragment>
  );
}
