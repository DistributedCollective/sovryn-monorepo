import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Wallet,
  ProviderType,
  LedgerWalletProvider,
  WalletProviderInterface,
  FullWallet,
  dPathMap,
} from '@sovryn/wallet';
import { Dialog } from './Dialog';
import { useWalletContext } from '../hooks';
import { DeterministicWallets } from './DeterministicWallets';
import { setWallet } from '../services';

interface Props {
  defaultChainId?: number;
  children: React.ReactNode;
}

enum DialogType {
  PROVIDER_LIST,
  WALLET_LIST,
}

export function WalletProvider(props: Props) {
  const walletRef = useRef(new Wallet(props.defaultChainId || 30));
  const wallet = walletRef.current;
  const context = useWalletContext();

  useEffect(() => {
    context.state.wallet.set(wallet);
    setWallet(wallet);
  }, [wallet]);

  const [
    selectedProvider,
    setSelectedProvider,
  ] = useState<WalletProviderInterface>(undefined as any);
  const [
    selectedProviderType,
    setSelectedProviderType,
  ] = useState<ProviderType>(undefined as any);
  const [dialog, setDialog] = useState(DialogType.PROVIDER_LIST);
  const [deterministic, setDeterministic] = useState({
    dPath:
      dPathMap.find(item => item.chainId === props.defaultChainId)?.value ||
      dPathMap[0].value,
    seed: undefined,
    chainCode: '',
    publicKey: '',
  });
  const [error, setError] = useState<string>(null as any);

  const onConnect = React.useCallback(
    async (providerType: ProviderType, dPath?: string) => {
      setError(null as any);
      try {
        const provider = await wallet.start(providerType);

        if (provider) {
          setSelectedProviderType(providerType);
          setSelectedProvider(provider as any);
          switch (providerType) {
            case ProviderType.WEB3: {
              // @ts-ignore
              const fullWallet = await provider.unlock();
              await wallet.connect(fullWallet);
              break;
            }
            case ProviderType.LEDGER: {
              setDialog(DialogType.WALLET_LIST);
              const {
                chainCode,
                publicKey,
              } = await LedgerWalletProvider.getChainCode(
                dPath || deterministic.dPath,
              );
              setDeterministic(prevState => ({
                ...prevState,
                chainCode,
                publicKey,
              }));
              break;
            }
          }
        }
      } catch (e) {
        setError(e.message);
      }
    },
    [deterministic.dPath],
  );

  const onDeterministicUnlock = useCallback(
    async (dPath: string, address: string, index: number) => {
      try {
        // @ts-ignore
        const fullWallet = await selectedProvider.unlock(dPath, address, index);
        await wallet.connect(fullWallet);
      } catch (e) {
        setError(e.message);
      }
    },
    [selectedProvider, wallet],
  );

  const onChangeDPath = useCallback(
    async (dPath: string) => {
      setDeterministic(prevState => ({ ...prevState, dPath: dPath }));
      await onConnect(selectedProviderType, dPath);
    },
    [deterministic, selectedProviderType],
  );

  useEffect(() => {
    console.log(selectedProviderType);
    wallet.events.on('connected', (value: FullWallet) => {
      console.log('connected', value);
      context.state.address.set(value.getAddressString());
      context.state.connected.set(true);
      context.state.loading.set(false);
    });
    wallet.events.on('disconnected', () => {
      context.state.address.set('');
      context.state.connected.set(false);
      context.state.loading.set(false);
    });
    return () => {};
  }, []);

  return (
    <React.Fragment>
      {props.children}
      <Dialog
        onClose={() => context.disconnect()}
        isOpen={context.state.loading.value}
      >
        {dialog === DialogType.PROVIDER_LIST && (
          <React.Fragment>
            {error && <p>{error}</p>}
            <button onClick={() => onConnect(ProviderType.WEB3)}>
              MetaMask
            </button>
            <button onClick={() => onConnect(ProviderType.LEDGER)}>
              Ledger
            </button>
          </React.Fragment>
        )}
        {dialog === DialogType.WALLET_LIST && (
          <React.Fragment>
            {error && <p>{error}</p>}
            <DeterministicWallets
              {...deterministic}
              dPaths={dPathMap}
              onUnlock={onDeterministicUnlock}
              onChangeDPath={onChangeDPath}
            />
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}
