import { useState } from '@hookstate/core';

const globalState = {
  wallet: {
    connected: false,
    address: '',
    loading: false,
  },
};

export function useWallet() {
  return useState(globalState);
}
