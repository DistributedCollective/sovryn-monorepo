import React from 'react'

import { WalletProvider } from '@sovryn/react-wallet';
import { Home } from './Home';

const App = () => {
  return <WalletProvider chainId={0} remember><Home /></WalletProvider>
};

export default App
