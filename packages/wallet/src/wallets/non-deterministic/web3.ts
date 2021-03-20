import Web3 from 'web3';
import { bufferToHex } from 'ethereumjs-util';
import { TransactionConfig } from 'web3-core';
import { FullWallet, NodeInterface } from '../../interfaces';
import debug from '../../utils/debug';
import { RawTransactionData } from '../../interfaces/wallet.interface';

const { log, error } = debug('web3-wallet');

export class Web3Wallet implements FullWallet {
  public chainId: number;

  private readonly address: string;
  private provider: any;

  constructor(address: string, chainId: number, provider: any) {
    this.address = address;
    this.chainId = chainId;
    this.provider = provider;
  }

  public getAddressString(): string {
    return this.address;
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public signRawTransaction(tx: RawTransactionData): Promise<string> {
    throw new Error('signRawTransaction is not available for web3 wallets.');
  }

  public sendTransaction(tx: RawTransactionData) {
    return new Promise((resolve, reject) => {
      new Web3(this.provider).eth
        .sendTransaction(this.prepareRawTransactionData(tx))
        .once('transactionHash', (response: string) => {
          log('signed transaction', response);
          resolve(Buffer.from(response));
        })
        .once('error', err => {
          error('sending failed', err);
          reject(err);
        });
    });
  }

  public async signMessage(
    msg: string,
    nodeLib: NodeInterface,
  ): Promise<string> {
    const msgHex = bufferToHex(Buffer.from(msg));
    console.log(msgHex);

    if (!nodeLib) {
      throw new Error('');
    }

    // return this.provider.
    return Promise.resolve('abc');
    // return nodeLib.signMessage(msgHex, this.address);
  }

  protected prepareRawTransactionData(
    tx: RawTransactionData,
  ): TransactionConfig {
    return {
      chainId: Number(tx.chainId || this.chainId),
      data: tx.data,
      from: this.getAddressString(),
      gas: tx.gasLimit,
      gasPrice: tx.gasPrice,
      nonce: Number(tx.nonce),
      to: tx.to,
      value: tx.value,
    };
  }
}
