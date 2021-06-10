import Web3 from 'web3';
import {
  BlockNumber,
  Transaction,
  TransactionConfig,
  TransactionReceipt,
} from 'web3-core';

import { NodeInterface } from '../../../interfaces';

export class Web3Node implements NodeInterface {
  protected provider: Web3;

  constructor(endpoint = 'web3') {
    if (endpoint === 'web3') {
      this.provider = new Web3((window as any).web3.currentProvider);
    } else {
      this.provider = new Web3(new Web3.providers.HttpProvider(endpoint));
    }
  }

  estimateGas(tx: TransactionConfig): Promise<number> {
    return this.provider.eth.estimateGas(tx);
  }

  getBalance(address: string): Promise<string> {
    return this.provider.eth.getBalance(address.toLowerCase());
  }

  getCurrentBlock(): Promise<number> {
    return this.provider.eth.getBlockNumber();
  }

  getBlock(blockNumber: BlockNumber) {
    return this.provider.eth.getBlock(blockNumber);
  }

  getTransactionByHash(txhash: string): Promise<Transaction> {
    return this.provider.eth.getTransaction(txhash);
  }

  getTransactionCount(address: string): Promise<number> {
    return this.provider.eth.getTransactionCount(address.toLowerCase());
  }

  getTransactionReceipt(txhash: string): Promise<TransactionReceipt> {
    return this.provider.eth.getTransactionReceipt(txhash);
  }

  ping(): Promise<boolean> {
    return this.provider.eth.net.isListening();
  }

  sendCallRequest(txObj: TransactionConfig): Promise<string> {
    return this.provider.eth.call(txObj);
  }

  sendRawTx(tx: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.provider.eth
        .sendSignedTransaction(tx)
        .once('transactionHash', value => resolve(value))
        .once('error', error => reject(error));
    });
  }
}
