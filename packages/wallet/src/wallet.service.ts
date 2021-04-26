import { FullWallet } from './interfaces';
import {
  NetworkDictionary,
  walletProviderMap,
  web3Wallets,
} from './dictionaries';
import { debug } from '@sovryn/common';
import { ProviderType } from './constants';
import { EventBag } from './utils';
import type { RawTransactionData } from './interfaces/wallet.interface';

const { log, error } = debug('@sovryn/wallet:wallet.service');

type WalletServiceEvents =
  | 'connected'
  | 'error'
  | 'disconnected'
  | 'connect'
  | 'disconnect';

export class WalletService {
  public readonly events: EventBag<WalletServiceEvents>;
  readonly networkDictionary: NetworkDictionary;

  private _wallet: FullWallet;
  private _providerType: ProviderType;

  constructor() {
    this.events = new EventBag<WalletServiceEvents>();
    this.networkDictionary = new NetworkDictionary();
    log('initialized');
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
    this._providerType = wallet.getWalletType() as ProviderType;
    this.events.trigger('connected', this._wallet);
    log('connected to wallet', wallet);
  }

  public async disconnect() {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
    // @ts-ignore
    this._wallet = null;
    // @ts-ignore
    this._providerType = null;
    this.events.trigger('disconnected');
    log('disconnected');
    return true;
  }

  /**
   * @deprecated use connected prop instead.
   */
  public isConnected() {
    return !!this.address;
  }

  public get connected() {
    return !!this.address && !!this.providerType;
  }

  /**
   * @deprecated use address prop instead.
   */
  public getAddress() {
    return this.address || '';
  }

  /**
   * @deprecated use wallet prop instead.
   */
  public getWallet(): FullWallet {
    return this._wallet;
  }

  public get address() {
    return this._wallet?.getAddressString() || '';
  }

  public get wallet() {
    return this._wallet;
  }

  public get providerType() {
    return this._providerType;
  }

  // If wallet provider gives chain id then return it here.
  public get chainId() {
    // @ts-ignore
    return this._wallet?.chainId || 0;
  }

  // todo dont actually use this.
  // todo remove this
  public signTransaction(tx: RawTransactionData) {
    log('sign tx', tx, this.providerType);
    if (!this.wallet) throw Error('Not connected');
    if (web3Wallets.includes(this.wallet.getWalletType() as ProviderType)) {
      return (this.wallet as any).sendTransaction(tx);
    }
    return this.wallet.signRawTransaction(tx);
  }

  public signMessage(message: string) {
    if (!this.wallet) throw Error('Not connected');
    return this.wallet.signMessage(message, {} as any);
  }
}
