import { toHex } from 'web3-utils';
import { addHexPrefix } from 'ethereumjs-util';
import { Transaction } from 'ethereumjs-tx';
import Web3 from 'web3';
import { Account } from 'web3-core';
import { debug } from '@sovryn/common';
import { stripHexPrefix } from 'ethjs-util';
import { FullWallet, RawTransactionData } from '../interfaces/wallet.interface';
import { ProviderType } from '../constants';

const { log, error } = debug('@sovryn/wallet:software-wallet');

export class SoftwareWallet implements FullWallet {
  private type: ProviderType;
  private account: Account;
  constructor(type: ProviderType, secret: string) {
    log('init');
    this.type = type;

    const web3 = new Web3();
    this.account =
      this.type === ProviderType.SOFTWARE_ENTROPY
        ? web3.eth.accounts.create(secret)
        : web3.eth.accounts.privateKeyToAccount(secret);
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

    const tx = new Transaction(hexed);

    const privateKey = Buffer.from(
      stripHexPrefix(this.account.privateKey),
      'hex',
    );

    tx.sign(privateKey);

    return addHexPrefix(tx.serialize().toString('hex'));
  }

  public async signMessage(msg: string): Promise<string> {
    log('sign message', msg);
    if (!msg) {
      throw Error('No message to sign');
    }
    try {
      const msgHex = Buffer.from(msg).toString('hex');
      const result = this.account.sign(msgHex);
      return addHexPrefix(result.signature);
    } catch (err) {
      error(err);
      throw new Error(err.message);
    }
  }

  getAddressString(): string {
    return this.account.address;
  }

  public getWalletType(): string {
    return this.type;
  }

  public disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
