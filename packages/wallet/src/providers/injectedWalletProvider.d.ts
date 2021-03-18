import { AbstractProvider } from './abstract-provider';
import { Wallet } from '../wallet';
import { FullWallet } from '../interfaces';
import PromiEvent from '../utils/promievent';
export declare class InjectedWalletProvider extends AbstractProvider {
    provider: any;
    wallet: Wallet;
    constructor(wallet: Wallet);
    init(): any;
    unlock(): PromiEvent<FullWallet>;
    disconnect(): Promise<boolean>;
}
