import { addHexPrefix, publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';

export class DeterministicWallet {
  chainId?: number;
  protected address: string;
  protected dPath: string;
  protected index: number;

  constructor(address: string, dPath: string, index: number, chainId?: number) {
    this.address = address;
    this.dPath = dPath;
    this.index = index;
    this.chainId = chainId;
  }

  public getAddressString(): string {
    return this.address;
  }

  public getPath(): string {
    return `${this.dPath}/${this.index}`;
  }
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

export const getDeterministicWallets = (
  args: GetDeterministicWalletsArgs,
): DeterministicWalletData[] => {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  let pathBase;
  let hdk;

  // if seed present, treat as mnemonic
  // if pubKey & chainCode present, treat as HW wallet
  if (seed) {
    hdk = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = Buffer.from(publicKey, 'hex');
    hdk.chainCode = Buffer.from(chainCode, 'hex');
    pathBase = 'm';
  } else {
    return [];
  }
  const wallets: DeterministicWalletData[] = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    wallets.push({
      index,
      address: addHexPrefix(address),
    });
  }
  return wallets;
};
