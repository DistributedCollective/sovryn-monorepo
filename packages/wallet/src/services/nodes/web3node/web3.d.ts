import { TransactionConfig, TransactionReceipt, Transaction, BlockNumber } from 'web3-core';
import Web3 from 'web3';
import { NodeInterface } from '../../../interfaces';
export declare class Web3Node implements NodeInterface {
    protected provider: Web3;
    constructor(endpoint?: string);
    estimateGas(tx: TransactionConfig): Promise<number>;
    getBalance(address: string): Promise<string>;
    getCurrentBlock(): Promise<number>;
    getBlock(blockNumber: BlockNumber): Promise<import("web3-eth").BlockTransactionString>;
    getTransactionByHash(txhash: string): Promise<Transaction>;
    getTransactionCount(address: string): Promise<number>;
    getTransactionReceipt(txhash: string): Promise<TransactionReceipt>;
    ping(): Promise<boolean>;
    sendCallRequest(txObj: TransactionConfig): Promise<string>;
    sendRawTx(tx: string): Promise<string>;
}
