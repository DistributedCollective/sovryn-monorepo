import { FullWallet } from './interfaces';
import { NetworkDetails } from './models';
import { NetworkDictionary, walletProviderMap } from './dictionaries';
import { Web3Wallet } from './wallets/non-deterministic';
import debug from './utils/debug';
import { ProviderType } from './constants';
import { EventBag } from './utils';
import type { RawTransactionData } from './interfaces/wallet.interface';

const { log, error } = debug('wallet');

type WalletServiceEvents = 'connected' | 'error' | 'disconnected';

export class Wallet {
  public readonly events: EventBag<WalletServiceEvents>;
  readonly networkDictionary: NetworkDictionary;

  private _wallet: FullWallet;

  constructor(defaultChainId: number, networks?: NetworkDetails[]) {
    this.events = new EventBag<WalletServiceEvents>();
    this.networkDictionary = new NetworkDictionary(networks);
    log('loaded for id', defaultChainId);
  }

  public async start(provider: ProviderType) {
    log(`get provider ${provider}`);
    const Provider = walletProviderMap[provider];
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
    this.events.trigger('connected', this._wallet);
    log('connected to wallet', wallet);
  }

  public async disconnect() {
    // @ts-ignore
    this._wallet = null;
    this.events.trigger('disconnected');
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
  public signTransaction(tx: RawTransactionData) {
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
