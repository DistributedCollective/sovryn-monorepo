import * as React from 'react';
import { ProviderType, Wallet } from '@sovryn/wallet';
import { useWallet } from '../hooks';
import { Dialog } from './Dialog';
import { useState } from 'react';
import { DeterministicWallets } from './DeterministicWallets';
import { LedgerWalletProvider } from '../../../../wallet/src/providers/ledger';

enum Step {
  MAIN,
  PROVIDER_LIST,
  WALLET_LIST,
}

interface Props {
  chainId: number;
}

export function WalletButton(props: Props) {
  const service = new Wallet(props.chainId);
  const { wallet, showProviderList } = useWallet();

  const [state, setState] = useState({
    step: Step.MAIN,
    providerType: null as any,
  });

  const [deterministic, setDeterministic] = useState({
    dPath: "m/44'/137'/0'/0",
    seed: undefined,
    chainCode: '',
    publicKey: '',
  });

  const onStart = React.useCallback(() => {
    wallet.loading.set(true);
    showProviderList.set(true);
    setState(prevState => ({ ...prevState, step: Step.PROVIDER_LIST }));
  }, []);

  const onConnect = React.useCallback(async (providerType: ProviderType) => {
    try {
      wallet.loading.set(true);
      const provider = await service.start(providerType);
      console.log(provider);

      if (provider) {
        switch (providerType) {
          case ProviderType.WEB3: {
            // @ts-ignore
            const w = await provider.unlock();
            await service.connect(w);
            break;
          }
          case ProviderType.LEDGER: {
            const data = await LedgerWalletProvider.getChainCode(
              deterministic.dPath,
            );
            setState(prevState => ({
              ...prevState,
              step: Step.WALLET_LIST,
              providerType: providerType,
            }));
            setDeterministic(prevState => ({
              ...prevState,
              chainCode: data.chainCode,
              publicKey: data.publicKey,
            }));
            break;
          }
        }
      }
    } finally {
      wallet.loading.set(false);
    }
  }, []);

  return (
    <React.Fragment>
      {!wallet.connected ? (
        <React.Fragment>
          <button onClick={onStart} disabled={wallet.loading.value}>
            {wallet.loading.value ? 'Connecting' : 'Connect'}
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={onStart} disabled={wallet.loading.value}>
            {wallet.loading.value ? 'Connecting' : 'Connect'}
          </button>
        </React.Fragment>
      )}

      <Dialog
        isOpen={state.step !== Step.MAIN}
        onClose={() => {
          showProviderList.set(false);
          wallet.loading.set(false);
          setState(prevState => ({ ...prevState, step: Step.MAIN }));
        }}
      >
        {state.step === Step.PROVIDER_LIST && (
          <React.Fragment>
            <button onClick={() => onConnect(ProviderType.WEB3)}>
              MetaMask
            </button>
            <button onClick={() => onConnect(ProviderType.LEDGER)}>
              Ledger
            </button>
          </React.Fragment>
        )}
        {state.step === Step.WALLET_LIST && (
          <React.Fragment>
            <DeterministicWallets {...deterministic} />
          </React.Fragment>
        )}
      </Dialog>

      {/* <Dialog onClose={} isOpen={}></Dialog> */}
    </React.Fragment>
  );
}

WalletButton.defaultProps = {
  chainId: 31,
};
