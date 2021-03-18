/// <reference types="node" />
import { TransactionConfig } from 'web3-core';
import { HardwareWallet } from './hardware';
export declare class LedgerWallet extends HardwareWallet {
    signRawTransaction(t: TransactionConfig): Promise<Buffer>;
    signMessage(msg: string): Promise<string>;
    displayAddress(): Promise<boolean>;
    getWalletType(): string;
}
