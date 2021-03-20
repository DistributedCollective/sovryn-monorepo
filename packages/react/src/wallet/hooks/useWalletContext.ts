import { useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { useState, createState, State } from '@hookstate/core';
// eslint-disable-next-line no-unused-vars
import type { Wallet } from '@sovryn/wallet';

interface StateInterface {
  connected: boolean;
  loading: boolean;
  address: string;

  showProviderList: boolean;
  showWalletList: boolean;

  wallet: Wallet;

  [key: string]: any;
}

const globalState = createState<StateInterface>({
  connected: false,
  loading: false,
  address: '',

  showProviderList: false,
  showWalletList: false,

  wallet: undefined as any,
});

interface ContextInterface {
  wallet: Wallet;
  state: State<Partial<StateInterface>>;
  address: string;
  connected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useWalletContext(): ContextInterface {
  const state = useState(globalState);

  const onConnect = useCallback(() => {
    state.showProviderList.set(true);
    state.loading.set(true);
  }, []);

  const onDisconnect = useCallback(() => {
    state.showProviderList.set(false);
    state.loading.set(false);
    state.connected.set(false);
    state.address.set('');
  }, []);

  return {
    state,
    wallet: state.wallet.value,
    address: state.address.value,
    connected: state.connected.value,
    loading: state.loading.value,
    connect: onConnect,
    disconnect: onDisconnect,
  };
}
