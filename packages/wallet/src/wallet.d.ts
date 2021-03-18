/// <reference types="node" />
import { TransactionConfig } from 'web3-core';
import { FullWallet } from './interfaces';
import { NetworkDetails } from './models';
import { NetworkDictionary } from './dictionaries';
import { ProviderType } from './constants';
export declare class Wallet {
    readonly networkDictionary: NetworkDictionary;
    private _wallet;
    constructor(defaultChainId: number, networks?: NetworkDetails[]);
    start(provider: ProviderType): Promise<import("./providers").InjectedWalletProvider | import("./providers").LedgerWalletProvider | undefined>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getAddress(): string;
    getWallet(): FullWallet;
    signTransaction(tx: TransactionConfig): Buffer | Promise<unknown>;
    signMessage(message: string): string | Promise<string>;
    protected setWallet(wallet: FullWallet): this;
}
