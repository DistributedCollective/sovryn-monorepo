import { Optional } from '../types';
import { AbstractProvider } from '../providers';
declare type Wallets = Map<string, typeof AbstractProvider>;
export declare class WalletProviderDictionary {
    readonly _wallets: Wallets;
    constructor();
    add(key: string, provider: typeof AbstractProvider): this;
    list(): string[];
    get(wallet: string): Optional<typeof AbstractProvider>;
}
export {};
