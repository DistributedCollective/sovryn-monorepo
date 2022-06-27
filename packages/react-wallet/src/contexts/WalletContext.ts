import React from 'react';
import { FullWallet, ProviderType, WalletService } from '@sovryn/wallet';
import { walletService } from '../services';

export const DEFAULT_CHAIN_ID = 30;

export interface WalletOptions {
  viewType: 'default' | 'gray';
  hideTitle: boolean;
}
export type WalletContextStateType = {
  wallet: WalletService;
  expectedChainId?: number;
  signTypedRequired?: boolean;
  chainId?: number;
  address?: string;
  hwIndex?: number;
  provider?: ProviderType;
  dPath?: string;
  seed?: string;
  chainCode?: string;
  publicKey?: string;
  uri?: string;
  connected: boolean;
  connecting: boolean;
  options?: WalletOptions;
};

export type WalletContextFunctionsType = {
  /**
   * Updates the context values
   */
  set: (newState: WalletContextStateType) => void;
  /**
   * Opens the WalletConnectionDialog
   */
  connect: () => void;
  /**
   * Disconnect from wallet, and reset context values
   */
  disconnect: () => void;
  /**
   * Set wallet options
   */
  setOptions: (options?: WalletOptions) => void;
  /**
   * Registers the passed wallet with the WalletService
   */
  setConnectedWallet: (wallet: FullWallet) => Promise<boolean>;
  /**
   * Tries to reconnect to the current active wallet.
   */
  reconnect: () => Promise<boolean>;
  /**
   * Creates a new wallet instance, tries to unlock it and registers it with the WalletService.
   */
  unlockDeterministicWallet: (
    address: string,
    index: number,
    provider: ProviderType,
    path?: string,
    chainId?: number,
  ) => Promise<boolean>;
  /**
   * Creates a new wallet instance, tries to unlock it and registers it with the WalletService.
   */
  unlockWeb3Wallet: (
    provider: ProviderType,
    chainId?: number,
  ) => Promise<boolean>;
  /**
   * Creates a new wallet instance, tries to unlock it and registers it with the WalletService.
   */
  unlockSoftwareWallet: (
    provider: ProviderType,
    entropy: string,
  ) => Promise<boolean>;
};

export type WalletContextType = WalletContextStateType &
  WalletContextFunctionsType;

const defaultValue: WalletContextType = {
  wallet: walletService,
  expectedChainId: undefined,
  signTypedRequired: false,
  connected: false,
  connecting: false,
  set: () => {
    throw new Error('set() has not been set!');
  },
  setOptions: () => {
    throw new Error('setOption() has not been set!');
  },
  disconnect: () => {
    throw new Error('disconnect() has not been set!');
  },
  reconnect: () => {
    throw new Error('set() has not been set!');
  },
  connect: () => {
    throw new Error('connect() has not been set!');
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
  unlockSoftwareWallet: () => {
    throw new Error('unlockSoftwareWallet() has not been set!');
  },
};

export const WalletContext = React.createContext<WalletContextType>(
  defaultValue,
);
