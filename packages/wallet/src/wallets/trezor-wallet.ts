import TrezorConnect from 'trezor-connect';
import { toHex } from 'web3-utils';
import { addHexPrefix } from 'ethereumjs-util';
import { Transaction } from 'ethereumjs-tx';
import { HardwareWallet } from './deterministic';
import { makeTrezorManifest } from '../providers';
import {
  calculateChainIdFromV,
  commonGenerator,
  getBufferFromHex,
} from '../utils';
import {
  RawTransactionData,
  RequestPayload,
} from '../interfaces/wallet.interface';
import { ProviderType } from '../constants';
import { debug } from '@sovryn/common';

const { log, error } = debug('@sovryn/wallet:trezor-wallet');

export class TrezorWallet extends HardwareWallet {
  constructor(address: string, dPath: string, index: number, chainId?: number) {
    log('init');
    super(address, dPath, index, chainId);
    makeTrezorManifest();
  }

  public async signRawTransaction(raw: RawTransactionData): Promise<string> {
    const hexed = {
      to: raw.to?.toLowerCase() as string,
      value: toHex(raw.value),
      gasLimit: toHex(raw.gasLimit),
      gasPrice: toHex(raw.gasPrice),
      nonce: toHex(raw.nonce),
      data: raw.data ? toHex(raw.data) : '0x',
    };

    log('data to send', hexed);

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

    const result = await TrezorConnect.ethereumSignTransaction({
      path: this.getPath(),
      transaction: {
        ...hexed,
        chainId: networkId,
      },
    });

    if (!result.success) throw Error(result.payload.error);

    let v = result.payload.v;
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
        r: getBufferFromHex(result.payload.r),
        s: getBufferFromHex(result.payload.s),
      },
      {
        common,
      },
    );

    const signedChainId = calculateChainIdFromV(signedTx.v as any);

    if (signedChainId !== networkId) {
      throw Error("Chains doesn't match");
    }

    return addHexPrefix(signedTx.serialize().toString('hex'));
  }

  public async signMessage(msg: string): Promise<string> {
    log('sign message', msg);
    if (!msg) {
      throw Error('No message to sign');
    }
    try {
      const msgHex = Buffer.from(msg).toString('hex');
      const result = await TrezorConnect.ethereumSignMessage({
        path: this.getPath(),
        message: msgHex,
        hex: true,
      });
      if (!result.success) throw Error(result.payload.error);
      return addHexPrefix(result.payload.signature);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      throw new Error(trezorErrToMessage(err));
    }
  }

  public async request(payload: RequestPayload) {
    if (payload.method === 'eth_signTypedData_v4') {
      return this.signEIP712HashedMessage(payload.params);
    }
    return Promise.reject(
      Error(`Method ${payload.method} is not available for trezor wallets.`),
    );
  }

  public async signEIP712HashedMessage(params: any[]) {
    try {
      let [, eip712Data] = params;

      if (typeof eip712Data === 'string') {
        eip712Data = JSON.parse(eip712Data);
      }

      // This functionality is separate from trezor-connect, as it requires @metamask/eth-sig-utils,
      // which is a large JavaScript dependency
      const transformTypedDataPlugin = await import(
        './trezor-plugins/typedData'
      ).then(module => module.default);

      const { domain_separator_hash, message_hash } = transformTypedDataPlugin(
        eip712Data,
        true,
      );

      const result = await TrezorConnect.ethereumSignTypedData({
        path: this.getPath(),
        data: eip712Data,
        metamask_v4_compat: true,
        // These are optional, but required for Trezor Model 1 compatibility
        domain_separator_hash,
        message_hash,
      });

      log('signed typed data:', result);

      return Promise.resolve((result.payload as any).signature);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async displayAddress() {
    const result = await TrezorConnect.ethereumGetAddress({
      path: this.getPath(),
      showOnTrezor: true,
    });
    return result.success;
  }

  public getWalletType(): string {
    return ProviderType.TREZOR;
  }
}

function trezorErrToMessage(err: Error) {
  error(err);
  return err.message;
}
