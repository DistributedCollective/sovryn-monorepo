import { TransactionConfig } from 'web3-core';
import { HardwareWallet } from './hardware';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import { ledgerErrToMessage, makeApp } from '../../providers/ledger';
import { stripHexPrefix } from 'web3-utils';
import { serializeTransaction } from 'ethers/lib/utils';
import { Signature } from 'ethers';
import { addHexPrefix } from 'ethereumjs-util';

export class LedgerWallet extends HardwareWallet {
  public async signRawTransaction(t: TransactionConfig): Promise<Buffer> {
    const { to, chainId } = t;

    if (!chainId) {
      throw Error('Missing chainId on tx');
    }

    try {
      const ethApp = await makeApp();

      if (chainId === 31 && to) {
        const tokenInfo = byContractAddress(to);
        if (tokenInfo) {
          await ethApp.provideERC20TokenInformation(tokenInfo);
        }
      }

      const result = await ethApp.signTransaction(
        this.getPath(),
        stripHexPrefix(serializeTransaction(t as any)),
      );

      let v = result.v;
      if (chainId > 0) {
        // EIP155 support. check/recalc signature v value.
        // Please see https://github.com/LedgerHQ/blue-app-eth/commit/8260268b0214810872dabd154b476f5bb859aac0
        // currently, ledger returns only 1-byte truncated signatur_v
        const rv = parseInt(v, 16);
        let cv = chainId * 2 + 35; // calculated signature v, without signature bit.
        /* tslint:disable no-bitwise */
        if (rv !== cv && (rv & cv) !== rv) {
          // (rv !== cv) : for v is truncated byte case
          // (rv & cv): make cv to truncated byte
          // (rv & cv) !== rv: signature v bit needed
          cv += 1; // add signature v bit.
        }
        v = cv.toString(16);
      }

      // @ts-ignore
      const signature: Signature = {
        v: parseInt(v),
        r: addHexPrefix(result.r),
        s: addHexPrefix(result.s),
      };

      // @ts-ignore
      const serializedTx = serializeTransaction(t, signature);

      return Buffer.from(stripHexPrefix(serializedTx), 'hex');
    } catch (err) {
      throw Error(err + '. Check to make sure contract data is on');
    }
  }

  public async signMessage(msg: string): Promise<string> {
    if (!msg) {
      throw Error('No message to sign');
    }

    try {
      const msgHex = Buffer.from(msg).toString('hex');
      const ethApp = await makeApp();
      const signed = await ethApp.signPersonalMessage(this.getPath(), msgHex);
      /*
       @ts-expect-error: There is a type mismatch between Signature and how we use it. @todo: resolve conflicts.
      */
      const combined = addHexPrefix(
        signed.r + signed.s + (signed.v as any).toString(16),
      );
      return combined;
    } catch (err) {
      throw new Error(ledgerErrToMessage(err));
    }
  }

  public async displayAddress() {
    const path = `${this.dPath}/${this.index}`;

    try {
      const ethApp = await makeApp();
      await ethApp.getAddress(path, true, false);
      return true;
    } catch (err) {
      console.error('Failed to display Ledger address:', err);
      return false;
    }
  }

  public getWalletType(): string {
    return 'Ledger';
  }
}
