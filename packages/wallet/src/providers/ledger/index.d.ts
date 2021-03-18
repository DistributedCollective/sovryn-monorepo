import LedgerEth from '@ledgerhq/hw-app-eth';
import { Wallet } from '../../wallet';
import { ChainCodeResponse, LedgerWallet } from '../../wallets';
import PromiEvent from '../../utils/promievent';
import { WalletProviderInterface } from '../../interfaces';
interface U2FError {
    metaData: {
        type: string;
        code: number;
    };
}
interface ErrorWithId {
    id: string;
    message: string;
    name: string;
    stack: string;
}
declare type LedgerError = U2FError | ErrorWithId | Error | string;
export declare function makeApp(): Promise<LedgerEth>;
export declare class LedgerWalletProvider implements WalletProviderInterface {
    protected _wallet: Wallet;
    static getChainCode(dPath: string): Promise<ChainCodeResponse>;
    init(dPath: string): Promise<ChainCodeResponse>;
    unlock(address: string, dPath: string, index: number): Promise<LedgerWallet>;
    connect(): PromiEvent<LedgerWallet>;
    disconnect(): Promise<boolean>;
}
export declare function ledgerErrToMessage(err: LedgerError): string;
export {};
