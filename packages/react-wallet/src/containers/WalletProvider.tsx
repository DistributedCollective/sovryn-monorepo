import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChainCodeResponse,
  FullWallet,
  LedgerWallet,
  ProviderType,
  Web3Wallet,
} from '@sovryn/wallet';
import { useWalletContext } from '../hooks';
import { walletService } from '../services';
import { ProviderList } from '../components/steps/ProviderList';
import { LedgerConnector } from '../components/steps/LedgerConnector';
import { DeterministicWallets } from '../components/steps/DeterministicWallets';

interface Props {
  chainId?: number;
  children: React.ReactNode;
}

enum DialogType {
  NONE,
  PROVIDER_LIST,
  LEDGER_CONNECTOR,
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
  }, [props.chainId]);

  useEffect(() => {
    if (context.loading && state.step === DialogType.NONE) {
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
      setState(prevState => ({ ...prevState, step: DialogType.NONE }));
    },
    [context],
  );

  const onProviderChosen = React.useCallback(async (provider: ProviderType) => {
    setState(prevState => ({ ...prevState, provider, loading: true }));
    try {
      switch (provider) {
        case ProviderType.WEB3: {
          const s = await walletService.start(provider);
          const w = await s.unlock();
          await setConnectedWallet(w);
          break;
        }
        case ProviderType.LEDGER:
          setState(prevState => ({
            ...prevState,
            step: DialogType.LEDGER_CONNECTOR,
          }));
          break;
      }
    } catch (e) {
      console.error(e);
      setState(prevState => ({ ...prevState, loading: false }));
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
    async (address: string, index: number) => {
      switch (state.provider) {
        case ProviderType.LEDGER: {
          await setConnectedWallet(
            new LedgerWallet(address, state.dPath, index),
          );
          break;
        }
      }
    },
    [state],
  );

  useEffect(() => {
    walletService.events.on('connected', (value: FullWallet) => {
      console.log('connected', value);
      context.state.address.set(value.getAddressString());
      context.state.connected.set(true);
      context.state.loading.set(false);
    });
    walletService.events.on('disconnected', () => {
      context.state.address.set('');
      context.state.connected.set(false);
      context.state.loading.set(false);
    });
    return () => {};
  }, []);

  useEffect(() => {
    const wallet = walletService.getWallet() as Web3Wallet;
    if (wallet?.getWalletType() === ProviderType.WEB3 && wallet?.provider) {
      const p = wallet.provider;

      // @ts-ignore
      p.on('disconnect', value => {
        console.log('disconnect web3');
      });

      // @ts-ignore
      p.on('accountsChanged', async value => {
        console.log('account changed', value);
        await onProviderChosen(ProviderType.WEB3);
      });

      // @ts-ignore
      p.on('chainChanged', async value => {
        await onProviderChosen(ProviderType.WEB3);
        console.log('chain changed', Number(value));
      });
    }
    return () => {};
  }, [context.wallet.getWallet()?.getWalletType()]);

  return (
    <React.Fragment>
      {context.wallet.getWallet()?.getWalletType() === ProviderType.WEB3 && (
        <React.Fragment>
          {props.chainId &&
            (context.wallet.getWallet() as Web3Wallet)?.chainId !==
              props.chainId &&
            'You are connected to wrong network.'}
        </React.Fragment>
      )}

      <div>{props.children}</div>

      <div>{JSON.stringify(context.state.value)}</div>

      <React.Fragment>
        <ProviderList
          isOpen={state.step === DialogType.PROVIDER_LIST}
          loading={state.loading}
          onClose={onDismiss}
          onProvider={onProviderChosen}
        />
        <LedgerConnector
          isOpen={state.step === DialogType.LEDGER_CONNECTOR}
          onClose={onDismiss}
          onComplete={onChainCodeChanged}
          chainId={context.chainId}
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

      {/* <Dialog */}
      {/*  onClose={() => context.disconnect()} */}
      {/*  isOpen={context.state.loading.value} */}
      {/* > */}
      {/*  {dialog === DialogType.PROVIDER_LIST && ( */}
      {/*    <React.Fragment> */}
      {/*      {error && <p>{error}</p>} */}
      {/*      <button onClick={() => onConnect(ProviderType.WEB3)}> */}
      {/*        MetaMask */}
      {/*      </button> */}
      {/*      <button onClick={() => onConnect(ProviderType.LEDGER)}> */}
      {/*        Ledger */}
      {/*      </button> */}
      {/*    </React.Fragment> */}
      {/*  )} */}
      {/*  {dialog === DialogType.WALLET_LIST && ( */}
      {/*    <React.Fragment> */}
      {/*      {error && <p>{error}</p>} */}
      {/*      <DeterministicWallets */}
      {/*        {...deterministic} */}
      {/*        dPaths={dPathMap} */}
      {/*        onUnlock={onDeterministicUnlock} */}
      {/*        onChangeDPath={onChangeDPath} */}
      {/*      /> */}
      {/*    </React.Fragment> */}
      {/*  )} */}
      {/* </Dialog> */}
    </React.Fragment>
  );
}
