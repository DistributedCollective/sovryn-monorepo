import { ConnectionType, ProviderType } from '../constants';

export class NetworkDetails {
  private _logo: string;
  private _nodeUrl: string;
  private _explorerTx: string;
  private _explorerAdr: string;
  private _networkId: number;
  private _dPaths: Map<ProviderType, string[]> = new Map<ProviderType, string[]>();

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private _chainId: number,
    private _name: string,
    private _networkType: ConnectionType = ConnectionType.MAINNET,
  ) {}

  public setNodeUrl(value: string) {
    this._nodeUrl = value;
    return this;
  }

  public getNodeUrl(): string {
    return this._nodeUrl;
  }

  public setExplorerTxUrl(value: string) {
    this._explorerTx = value;
    return this;
  }

  public getExplorerTxUrl(): string {
    return this._explorerTx;
  }

  public setExplorerAdrUrl(value: string) {
    this._explorerAdr = value;
    return this;
  }

  public getExplorerAdrUrl(): string {
    return this._explorerAdr;
  }

  public setLogo(value: string) {
    this._logo = value;
    return this;
  }

  public getLogo(): string {
    return this._logo;
  }

  public setNetworkId(value: number) {
    this._networkId = value;
    return this;
  }

  public getNetworkId(): number {
    return this._networkId;
  }

  public getChainId() {
    return this._chainId;
  }

  public getName() {
    return this._name;
  }

  public getNetworkType() {
    return this._networkType;
  }

  public setDPaths(dPaths: Map<ProviderType, string[]>) {
    this._dPaths = dPaths;
    return this;
  }

  public getDPaths(): Map<ProviderType, string[]> {
    return this._dPaths;
  }

  public setWalletDPaths(wallet: ProviderType, paths: string[]) {
    this._dPaths.set(wallet, paths);
    return this;
  }

  public getWalletDPaths(wallet: ProviderType) {
    return this._dPaths.get(wallet);
  }
}
