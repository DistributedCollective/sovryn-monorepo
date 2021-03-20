import type { TxData } from 'ethereumjs-tx';
import type { FullWallet } from '../../interfaces';
import { DeterministicWallet } from './deterministic-wallet';

export interface ChainCodeResponse {
  chainCode: string;
  publicKey: string;
  address?: string;
}

export abstract class HardwareWallet
  extends DeterministicWallet
  implements FullWallet {
  // Static functions can't be abstract, so implement an errorous one
  // @ts-expect-error: Terrible class inheritance pattern
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getChainCode(dPath: string): Promise<ChainCodeResponse> {
    throw new Error(
      `getChainCode is not implemented in ${this.constructor.name}`,
    );
  }

  public abstract signRawTransaction(t: TxData): Promise<string>;
  public abstract signMessage(msg: string): Promise<string>;
  public abstract displayAddress(): Promise<boolean>;
  public abstract getWalletType(): string;
}
