import { WalletType } from '../constants';
import { InjectedWalletProvider } from '../providers';
import { LedgerWalletProvider } from '../providers/ledger';

export const providersDictionary = {
  [WalletType.WEB3]: InjectedWalletProvider,
  [WalletType.LEDGER]: LedgerWalletProvider,
};

export type ProviderType = keyof typeof providersDictionary;
