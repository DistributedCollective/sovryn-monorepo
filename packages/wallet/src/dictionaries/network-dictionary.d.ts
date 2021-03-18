import { NetworkDetails } from '../models';
import { ConnectionType } from '../constants';
import { Optional } from '../types';
export declare class NetworkDictionary {
    private _networks;
    constructor(networks?: NetworkDetails[]);
    set(networks: NetworkDetails[]): this;
    add(network: NetworkDetails | NetworkDetails[]): this;
    list(): NetworkDetails[];
    list(networkType: ConnectionType): NetworkDetails[];
    get(chainId: number): Optional<NetworkDetails>;
}
