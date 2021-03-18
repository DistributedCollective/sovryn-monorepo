/// <reference types="node" />
import { TransactionConfig } from 'web3-core';
import { FullWallet, NodeInterface } from '../../interfaces';
export declare class Web3Wallet implements FullWallet {
    chainId: number;
    private readonly address;
    private provider;
    constructor(address: string, chainId: number, provider: any);
    getAddressString(): string;
    signRawTransaction(tx: TransactionConfig): Promise<Buffer>;
    sendTransaction(tx: TransactionConfig): Promise<unknown>;
    signMessage(msg: string, nodeLib: NodeInterface): Promise<string>;
}
