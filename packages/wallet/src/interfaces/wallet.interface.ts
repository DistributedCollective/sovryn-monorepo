import { TransactionConfig } from 'web3-core';
import { NodeInterface } from './node.interface';

interface BaseWallet {
  isReadOnly?: boolean;
  getAddressString(): string;
}

export interface ReadOnlyWallet extends BaseWallet {
  isReadOnly: true;
}

export interface FullWallet extends BaseWallet {
  isReadOnly?: false;
  signRawTransaction(tx: TransactionConfig): Promise<Buffer> | Buffer;
  signMessage(msg: string, node: NodeInterface): Promise<string> | string;
}

export type WalletType = ReadOnlyWallet | FullWallet;
