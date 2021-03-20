import React, { useCallback, useEffect, useState } from 'react';

import { LedgerWallet, Web3Node, determineWallet } from '@sovryn/wallet';


const nets = {
  eth: {
    chainID: 1,
    path: "m/44'/60'/0'/0",
    node: 'https://mainnet.infura.io/v3/8a669f27b05a457b880dfa89b536c220',
    gasPrice: 100000000000,
  },
  rsk: {
    chainID: 30,
    path: "m/44'/137'/0'/0",
    node: 'https://public-node.rsk.co',
    gasPrice: 65164000,
  },
  ropsten: {
    chainID: 3,
    path: "m/44'/1'/0'/0",
    node: 'https://ropsten.infura.io/v3/8a669f27b05a457b880dfa89b536c220',
    gasPrice: 100000000000,
  }
};

const conf = nets.rsk;

const node = new Web3Node(conf.node);

export const Wallet = () => {


  const [wallet, setWallet] = useState<LedgerWallet>(null as any);

  const start = useCallback(() => {
    const fn = async () => {
      const from = await determineWallet(conf.path, 0);
      return new LedgerWallet(from, conf.path, 0);
    };
    fn().then(e => setWallet(e));
  }, []);


  const sign = useCallback(async () => {
    try {
      const signed = await wallet.signMessage('abc');
      // const signed = await wallet.signMessage('test');
      console.log('signed', signed);
    } catch (e) {
      console.error(e);
    }
  }, [wallet]);

  const [tx, setTx] = useState('');
  const [balance, setBalance] = useState('0');

  const send = useCallback(async () => {
    try {
      const nonce = await node.getTransactionCount(wallet.getAddressString());
      // const estimate = await node.estimateGas({
      //   value: '1',
      //   to: wallet.getAddressString().toLowerCase(),
      //   chainId: conf.chainID,
      //   nonce: nonce,
      //   gasPrice: conf.gasPrice.toString(),
      // });
      const estimate = 21000;
      console.log({ nonce, estimate });
      const tx = await wallet.signRawTransaction({
        value: '1',
        to: wallet.getAddressString().toLowerCase(),
        chainId: conf.chainID,
        nonce: nonce,
        gasPrice: conf.gasPrice.toString(),
        gasLimit: estimate.toString(),
      });
      setTx(tx);
      console.log('send', tx);
    } catch (e) {
      console.error(e);
    }
  }, [wallet]);

  const sendToNode = useCallback(() => {
    try {
      node.sendRawTx(tx).then((e: any) => {
        setTx(e);
        console.log('tx hash', e)
      }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, [tx]);

  useEffect(() => {
    setBalance('0');
    if (wallet?.getAddressString()) {
      node.getBalance(wallet.getAddressString()).then(setBalance).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.getAddressString()]);

  return <div>
    {!wallet ? <button onClick={start}>Start</button> : (
      <div>
        <div>Connected: {wallet?.getAddressString()}</div>
        <div>Balance: {balance}</div>
        <div>
          <button onClick={sign}>Sign message</button>
          <button onClick={send}>Send balance</button>
          <button onClick={sendToNode} disabled={!tx}>Send tx</button>
        </div>
      </div>
    )}
  </div>
};

