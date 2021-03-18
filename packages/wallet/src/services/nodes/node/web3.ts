import {
  TransactionConfig,
  TransactionReceipt,
  Transaction,
  BlockNumber,
} from 'web3-core';
import Web3 from 'web3';
import { NodeInterface } from '../../../interfaces';

export class Web3Node implements NodeInterface {
  protected provider: Web3;

  constructor(endpoint: string) {
    this.provider = new Web3(new Web3.providers.HttpProvider(endpoint));
  }

  estimateGas(tx: TransactionConfig): Promise<number> {
    return this.provider.eth.estimateGas(tx);
  }

  getBalance(address: string): Promise<string> {
    return this.provider.eth.getBalance(address);
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
    return this.provider.eth.getTransactionCount(address);
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
