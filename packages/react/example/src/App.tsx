import React from 'react'

import { WalletProvider } from '@sovryn/react/dist';
import { Wallet } from './Wallet';

export const chainId = 30;

const App = () => {
  return <WalletProvider defaultChainId={chainId}><Wallet/></WalletProvider>
};

export default App
