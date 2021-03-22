# @sovryn/react-wallet

[![NPM](https://img.shields.io/npm/v/@sovryn/react-wallet.svg)](https://www.npmjs.com/package/@sovryn/react-wallet) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @sovryn/react-wallet
```

## Usage

```tsx
import React, { Component } from 'react';

import { WalletProvider, WalletButton, useWalletContext } from '@sovryn/react-wallet';
import '@sovryn/react-wallet/index.css'

class App extends Component {
  render() {
    return <WalletProvider chainId={30} remember><Home /></WalletProvider>
  }
}

class Home extends Component {
  const { address } = useWalletContext();
  render() {
    return <>{!address ? <WalletButton /> : <p>Connected with {address}</p>)}</>
  }
}

```

## License

MIT © [grinry](https://github.com/grinry)
