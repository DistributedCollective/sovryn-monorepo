import { ProviderType } from '../constants';
import { InjectedWalletProvider } from '../providers';
import { LedgerWalletProvider } from '../providers/ledger';
export declare const providersDictionary: {
    injected: typeof InjectedWalletProvider;
    ledger: typeof LedgerWalletProvider;
};
