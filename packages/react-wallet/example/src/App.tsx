import React from 'react'

import { WalletProvider } from '@sovryn/react-wallet';
import { Home } from './Home';

const App = () => {
  return <WalletProvider options={{ chainId: 31, remember: true, enableSoftwareWallet: true }} portalTargetId="overlay"><Home /></WalletProvider>
};

export default App
