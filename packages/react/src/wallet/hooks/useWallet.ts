import { useState } from '@hookstate/core';

const globalState = {
  showProviderList: false,
  showWalletList: false,
  wallet: {
    connected: false,
    address: '',
    loading: false,
  },
};

export function useWallet() {
  return useState(globalState);
}
