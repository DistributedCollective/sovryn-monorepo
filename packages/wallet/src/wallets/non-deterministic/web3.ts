import Web3 from 'web3';
import { bufferToHex } from 'ethereumjs-util';
import { TransactionConfig, provider } from 'web3-core';
import { debug } from '@sovryn/common';
import { FullWallet } from '../../interfaces';
import { RawTransactionData } from '../../interfaces/wallet.interface';
import { ProviderType } from '../../constants';

const { log, error } = debug('@sovryn/wallet:web3-wallet');

export class Web3Wallet implements FullWallet {
  public chainId: number;

  readonly address: string;
  readonly provider: provider;

  constructor(address: string, chainId: number, provider: provider) {
    this.address = address;
    this.chainId = chainId;
    this.provider = provider;
  }

  public getAddressString(): string {
    return this.address;
  }

  public signRawTransaction(tx: RawTransactionData): Promise<string> {
    return new Promise((resolve, reject) => {
      new Web3(this.provider).eth
        .signTransaction(this.prepareRawTransactionData(tx))
        .then(response => {
          log('signed raw transaction', response);
          resolve(response.raw);
        })
        .catch(reason => {
          error('failed to sign raw transaction', reason);
          reject(reason);
        });
    });
  }

  public sendTransaction(tx: RawTransactionData) {
    return new Promise((resolve, reject) => {
      new Web3(this.provider).eth
        .sendTransaction(this.prepareRawTransactionData(tx))
        .once('transactionHash', (response: string) => {
          log('signed transaction', response);
          resolve(response);
        })
        .once('error', err => {
          error('sending failed', err);
          reject(err);
        });
    });
  }

  public async signMessage(msg: string): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));
    return new Web3(this.provider).eth.personal.sign(
      msgHex,
      this.address.toLowerCase(),
      '',
    );
  }

  public getWalletType(): string {
    return ProviderType.WEB3;
  }

  public disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected prepareRawTransactionData(
    tx: RawTransactionData,
  ): TransactionConfig {
    const chainId = Number(tx.chainId || this.chainId);
    return {
      chainId,
      data: tx.data,
      from: this.address.toLowerCase(),
      gas: tx.gasLimit,
      gasPrice: tx.gasPrice,
      nonce: Number(tx.nonce),
      to: tx.to?.toLowerCase(),
      value: tx.value,
    };
  }
}
