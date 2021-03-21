import React, { useCallback } from 'react';

import { useWalletContext, WalletButton, walletService } from '@sovryn/react/dist';
import '@sovryn/react/dist/index.css';

export const Home = () => {
  const { address, connected } = useWalletContext();

  const sign = useCallback(async () => {
    try {
      const signed = await walletService.signMessage('abc');
      // const signed = await wallet.signMessage('test');
      console.log('signed', signed);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const send = useCallback(async () => {
    try {
      // const tx = await getWallet().signTransaction({
      //   value: 0,
      //   to: '0x2bD2201bfe156a71EB0d02837172FFc237218505',
      //   chainId: chainId,
      //   nonce: 1,
      //   gasPrice: 75,
      //   gas: 750000,
      // });
      // console.log('send', tx);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return <div>
    {!connected && <WalletButton/>}
    {connected && (
      <React.Fragment>
        <div>Connected: {address}</div>
        <div>
          <button onClick={sign}>Sign message</button>
          <button onClick={send}>Send balance</button>
        </div>
      </React.Fragment>
    )}
  </div>
};
