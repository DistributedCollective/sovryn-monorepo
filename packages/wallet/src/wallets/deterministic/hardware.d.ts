/// <reference types="node" />
import { TransactionConfig } from 'web3-core';
import { FullWallet } from '../../interfaces';
import { DeterministicWallet } from './deterministic-wallet';
export interface ChainCodeResponse {
    chainCode: string;
    publicKey: string;
    address?: string;
}
export declare abstract class HardwareWallet extends DeterministicWallet implements FullWallet {
    static getChainCode(dpath: string): Promise<ChainCodeResponse>;
    abstract signRawTransaction(t: TransactionConfig): Promise<Buffer>;
    abstract signMessage(msg: string): Promise<string>;
    abstract displayAddress(): Promise<boolean>;
    abstract getWalletType(): string;
}
