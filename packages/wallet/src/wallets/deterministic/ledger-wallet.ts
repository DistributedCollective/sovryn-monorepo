import { HardwareWallet } from './hardware';
// import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import { ledgerErrToMessage, makeApp } from '../../providers/ledger';
import { toHex } from 'web3-utils';
import { addHexPrefix } from 'ethereumjs-util';
// import { prepareHardwareTransaction } from '../../utils';
import { Transaction } from 'ethereumjs-tx';
import {
  calculateChainIdFromV,
  commonGenerator,
  getBufferFromHex,
} from '../../utils';
// import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import { RawTransactionData } from '../../interfaces/wallet.interface';

export class LedgerWallet extends HardwareWallet {
  public async signRawTransaction(raw: RawTransactionData): Promise<string> {
    const hexed = {
      to: raw.to?.toLowerCase(),
      value: toHex(raw.value),
      gasLimit: toHex(raw.gasLimit),
      gasPrice: toHex(raw.gasPrice),
      nonce: toHex(raw.nonce),
      data: raw.data ? toHex(raw.data) : '0x',
    };

    console.log('data to send', hexed);

    const common = commonGenerator(raw);

    const tx = new Transaction(hexed, {
      common,
    });

    const networkId = tx.getChainId();

    // @ts-ignore
    tx.raw[6] = Buffer.from([networkId]);
    tx.raw[7] = Buffer.from([]);
    tx.raw[8] = Buffer.from([]);

    if (!raw.chainId) {
      throw Error('Missing chainId on tx');
    }

    const ethApp = await makeApp();

    // if (tx.to) {
    //   const tokenInfo = byContractAddress(tx.to.toString());
    //   if (tokenInfo) {
    //     await ethApp.provideERC20TokenInformation(tokenInfo);
    //   }
    // }

    console.log('please', this.getPath(), tx.serialize().toString('hex'));

    const result = await ethApp.signTransaction(
      this.getPath(),
      tx.serialize().toString('hex'),
    );

    let v = result.v;
    if (raw.chainId && raw.chainId > 0) {
      // EIP155 support. check/recalc signature v value.
      // Please see https://github.com/LedgerHQ/blue-app-eth/commit/8260268b0214810872dabd154b476f5bb859aac0
      // currently, ledger returns only 1-byte truncated signatur_v
      const rv = parseInt(v, 16);
      let cv = raw.chainId * 2 + 35; // calculated signature v, without signature bit.
      /* tslint:disable no-bitwise */
      if (rv !== cv && (rv & cv) !== rv) {
        // (rv !== cv) : for v is truncated byte case
        // (rv & cv): make cv to truncated byte
        // (rv & cv) !== rv: signature v bit needed
        cv += 1; // add signature v bit.
      }
      v = cv.toString(16);
    }

    const signedTx = new Transaction(
      {
        ...hexed,
        v: getBufferFromHex(v),
        r: getBufferFromHex(result.r),
        s: getBufferFromHex(result.s),
      },
      {
        common,
      },
    );

    console.log({ signedTx }, signedTx.serialize().toString('hex'));

    const signedChainId = calculateChainIdFromV(signedTx.v as any);

    if (signedChainId !== networkId) {
      throw Error("Chains doesn't match");
    }

    return addHexPrefix(signedTx.serialize().toString('hex'));
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
