import type WCProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { debug } from '@sovryn/common';
import {
  RawTransactionData,
  RequestPayload,
} from '../../interfaces/wallet.interface';
import { ProviderType } from '../../constants';
import { Web3Wallet } from './web3';
import { bufferToHex } from 'ethereumjs-util';

const { log, error } = debug('@sovryn/wallet:walletconnect');

export class WalletConnectWallet extends Web3Wallet {
  // @ts-ignore
  readonly _provider: Web3;
  readonly wcProvider: WCProvider;

  constructor(address: string, chainId: number, provider: any) {
    super(address, chainId, provider);
    this.wcProvider = provider;
    this._provider = new Web3(provider);
  }

  // @ts-ignore
  public get provider(): Web3 {
    return this._provider;
  }

  // disconnect if the user is is out
  public getWalletType(): string {
    return ProviderType.WALLET_CONNECT;
  }

  public disconnect(): Promise<boolean> {
    if (!this.wcProvider) {
      return Promise.resolve(true);
    }
    try {
      return this.wcProvider
        .disconnect()
        .then(() => true)
        .catch(() => true); // still true
    } catch (e) {
      return Promise.resolve(true);
    }
  }

  public signRawTransaction(tx: RawTransactionData): Promise<string> {
    return new Promise((resolve, reject) => {
      this.provider.eth
        .signTransaction(this.prepareRawTransactionData(tx))
        .then(response => {
          log('signed raw transaction', response);
          resolve(response.raw);
        })
        .catch(reason => {
          error('failed to sign raw transaction', reason);
          reject(reason);
        });
    });
  }

  public sendTransaction(tx: RawTransactionData) {
    return new Promise((resolve, reject) => {
      this.provider.eth
        .sendTransaction(this.prepareRawTransactionData(tx))
        .once('transactionHash', (response: string) => {
          log('signed transaction', response);
          resolve(response);
        })
        .once('error', err => {
          error('sending failed', err);
          reject(err);
        });
    });
  }

  public async signMessage(msg: string): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));
    return this.provider.eth.personal.sign(
      msgHex,
      this.address.toLowerCase(),
      '',
    );
  }

  public request(payload: RequestPayload) {
    if (!this.provider) {
      return Promise.reject(Error('provider is not availble'));
    }

    return this.wcProvider.request(payload);
  }
}
