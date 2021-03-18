export declare class DeterministicWallet {
    protected address: string;
    protected dPath: string;
    protected index: number;
    constructor(address: string, dPath: string, index: number);
    getAddressString(): string;
    getPath(): string;
}
export interface GetDeterministicWalletsArgs {
    seed?: string;
    dPath: string;
    publicKey?: string;
    chainCode?: string;
    limit: number;
    offset: number;
}
export interface DeterministicWalletData {
    index: number;
    address: string;
}
export declare const getDeterministicWallets: (args: GetDeterministicWalletsArgs) => DeterministicWalletData[];
