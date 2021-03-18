import {
  TransactionConfig,
  TransactionReceipt,
  Transaction,
} from 'web3-core';

export interface NodeInterface {
  ping(): Promise<boolean>;
  getBalance(address: string): Promise<string>;
  estimateGas(tx: TransactionConfig): Promise<number>;
  getTransactionCount(address: string): Promise<number>;
  getTransactionByHash(txhash: string): Promise<Transaction>;
  getTransactionReceipt(txhash: string): Promise<TransactionReceipt>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: any): Promise<string>;
  getCurrentBlock(): Promise<number>;
}
