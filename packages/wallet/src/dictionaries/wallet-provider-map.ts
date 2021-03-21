import { ProviderType } from '../constants';
import { InjectedWalletProvider, LedgerWalletProvider } from '../providers';

export const walletProviderMap = {
  [ProviderType.WEB3]: InjectedWalletProvider,
  [ProviderType.LEDGER]: LedgerWalletProvider,
};
