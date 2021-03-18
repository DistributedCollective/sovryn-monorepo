import { TransactionConfig } from 'web3-core';
import { FullWallet } from './interfaces';
import { NetworkDetails } from './models';
import { NetworkDictionary, providersDictionary } from './dictionaries';
import { Web3Wallet } from './wallets/non-deterministic';
import debug from './utils/debug';
import { ProviderType } from './constants';

const { log, error } = debug('wallet');

export class Wallet {
  readonly networkDictionary: NetworkDictionary;

  private _wallet: FullWallet;

  constructor(defaultChainId: number, networks?: NetworkDetails[]) {
    this.networkDictionary = new NetworkDictionary(networks);
    log('loaded for id', defaultChainId);
  }

  public async start(provider: ProviderType) {
    log(`get provider ${provider}`);
    const Provider = providersDictionary[provider];
    log(`retrieved provider aa`, Provider);
    if (Provider) {
      // @ts-ignore
      return new Provider(this);
    } else {
      error('provider not found.');
      return undefined;
    }
  }

  public async connect(wallet: FullWallet) {
    this._wallet = wallet;
    log('connected to wallet', wallet);
  }

  public async disconnect() {
    // @ts-ignore
    this._wallet = null;
    error('disconnected');
  }

  public isConnected() {
    return !!this.getWallet()?.getAddressString();
  }

  public getAddress() {
    return this.getWallet()?.getAddressString() || '';
  }

  public getWallet(): FullWallet {
    log('get wallet info', this._wallet);
    return this._wallet;
  }

  // todo dont actually use this.
  // todo remove this
  public signTransaction(tx: TransactionConfig) {
    log('sign tx', tx, this.getWallet());
    const wallet = this.getWallet();
    if (wallet instanceof Web3Wallet) {
      return wallet.sendTransaction(tx);
    }
    return wallet.signRawTransaction(tx);
  }

  public signMessage(message: string) {
    return this.getWallet().signMessage(message, {} as any);
  }

  protected setWallet(wallet: FullWallet) {
    this._wallet = wallet;
    return this;
  }
}
