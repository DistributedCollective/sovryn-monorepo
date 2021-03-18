import { Optional } from '../types';
import {
  AbstractProvider,
  InjectedWalletProvider,
  LedgerWalletProvider,
} from '../providers';
import { ProviderType } from '../constants';

type Wallets = Map<string, typeof AbstractProvider>;

export class WalletProviderDictionary {
  readonly _wallets: Wallets = new Map();

  constructor() {
    // @ts-ignore
    this._wallets = new Map([
      [ProviderType.WEB3, InjectedWalletProvider],
      [ProviderType.LEDGER, LedgerWalletProvider],
    ]);
  }

  public add(key: string, provider: typeof AbstractProvider) {
    this._wallets.set(key, provider);
    return this;
  }

  public list(): string[] {
    return Array.from(this._wallets.keys());
  }

  public get(wallet: string): Optional<typeof AbstractProvider> {
    return this._wallets.get(wallet);
  }
}
