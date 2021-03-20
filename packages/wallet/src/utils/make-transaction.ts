import { TransactionConfig } from 'web3-core';
import BigNumber from 'bignumber.js';
import Common from 'ethereumjs-common';
import { RawTransactionData } from '../interfaces/wallet.interface';

export function prepareHardwareTransaction(t: TransactionConfig) {
  // Hardware wallets need `from` param excluded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { from, gas, ...tx } = t;
  // @ts-ignore
  return { ...tx, nonce: new BigNumber(t.nonce, 10).toNumber(), gasLimit: gas };
}

export function commonGenerator(tx: RawTransactionData): Common {
  const customCommon = Common.forCustomChain(
    'mainnet',
    {
      name: 'RSK',
      chainId: tx.chainId,
    },
    'petersburg',
    ['petersburg'],
  );
  // @ts-ignore
  return new Common(customCommon._chainParams, 'petersburg', ['petersburg']);
}
