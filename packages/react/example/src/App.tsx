import React from 'react'

import { WalletProvider } from '@sovryn/react/dist';
import { Home } from './Home';

const App = () => {
  return <WalletProvider chainId={30}><Home /></WalletProvider>
};

export default App
