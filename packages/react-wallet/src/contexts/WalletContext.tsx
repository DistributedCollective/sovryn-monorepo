import React from 'react';
import { FullWallet, ProviderType, WalletService } from '../../../wallet/dist';

export type WalletContextStateType = {
  walletService?: WalletService;
  wallet?: FullWallet;
  expectedChainId?: number;
  chainId?: number;
  address?: string;
  provider?: ProviderType;
  dPath?: string;
  seed?: string;
  chainCode?: string;
  publicKey?: string;
  uri?: string;
  connected: boolean;
  connecting: boolean;
};

export type WalletContextFunctionsType = {
  set: (newState: WalletContextStateType) => void;
  startConnectionDialog: () => void;
  disconnect: () => void;
  setConnectedWallet: (wallet: FullWallet) => Promise<boolean>;
  unlockDeterministicWallet: (
    address: string,
    index: number,
    provider: ProviderType,
    path?: string,
    chainId?: number,
  ) => Promise<boolean>;
  unlockWeb3Wallet: (
    provider: ProviderType,
    chainId: number,
  ) => Promise<boolean>;
};

export type WalletContextType = WalletContextStateType &
  WalletContextFunctionsType;

const defaultValue: WalletContextType = {
  walletService: undefined,
  connected: false,
  connecting: false,
  set: () => {
    throw new Error('set() has not been set!');
  },
  disconnect: () => {
    throw new Error('disconnect() has not been set!');
  },
  startConnectionDialog: () => {
    throw new Error('startConnectionDialog() has not been set!');
  },
  setConnectedWallet: () => {
    throw new Error('setConnectedWallet() has not been set!');
  },
  unlockDeterministicWallet: () => {
    throw new Error('unlockDeterministicWallet() has not been set!');
  },
  unlockWeb3Wallet: () => {
    throw new Error('unlockWeb3Wallet() has not been set!');
  },
};

export const WalletContext = React.createContext<WalletContextType>(
  defaultValue,
);
