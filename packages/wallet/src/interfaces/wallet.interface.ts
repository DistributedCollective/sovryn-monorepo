import type { NodeInterface } from './node.interface';

interface BaseWallet {
  isReadOnly?: boolean;
  getAddressString(): string;
}

export interface ReadOnlyWallet extends BaseWallet {
  isReadOnly: true;
}

export interface RawTransactionData {
  to?: string;
  data?: string;
  chainId?: number;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
}

export interface RequestPayload {
  method: string;
  params: any[];
};

export type RequestResponse = string | { result: string; };

export interface FullWallet extends BaseWallet {
  isReadOnly?: false;
  chainId?: number;
  signRawTransaction(tx: RawTransactionData): Promise<string>;
  signMessage(msg: string, node: NodeInterface): Promise<string>;
  getWalletType(): string;
  disconnect(): Promise<boolean>;
  request(payload: RequestPayload): Promise<RequestResponse>;
}

export type WalletType = ReadOnlyWallet | FullWallet;
