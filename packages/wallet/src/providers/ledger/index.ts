import LedgerEth from '@ledgerhq/hw-app-eth';
// import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
// import Transport from '@ledgerhq/hw-transport';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
// import { serializeTransaction, Signature, UnsignedTransaction } from 'ethers/utils';
import { Wallet } from '../../wallet';
import debug from '../../utils/debug';
import { WalletType } from '../../constants';
import { ChainCodeResponse, LedgerWallet } from '../../wallets';
import PromiEvent from '../../utils/promievent';
import { WalletProviderInterface } from '../../interfaces';

const { log, error } = debug('ledger-provider');

// Ledger throws a few types of errors
interface U2FError {
  metaData: {
    type: string;
    code: number;
  };
}

interface ErrorWithId {
  id: string;
  message: string;
  name: string;
  stack: string;
}

function translateRaw(key: string) {
  return key;
}

type LedgerError = U2FError | ErrorWithId | Error | string;

const getTransport = async () => {
  log('creating transport1');
  try {
    // if (await TransportWebBLE.isSupported()) {
    //   log('creating bluetooth transport');
    //   return TransportWebBLE.create();
    // }
    if (await TransportWebUSB.isSupported()) {
      log('creating usb transport');
      return TransportWebUSB.create();
    }
  } catch (e) {
    error('no supported transport', e);
  }
  log('connecting with u2f');
  return TransportU2F.create();
};

export async function makeApp() {
  log('make app');
  const transport = await getTransport();
  return new LedgerEth(transport);
}

export class LedgerWalletProvider implements WalletProviderInterface {
  protected _wallet: Wallet;

  public static async getChainCode(dPath: string): Promise<ChainCodeResponse> {
    return makeApp()
      .then(app => app.getAddress(dPath, false, true))
      .then(res => {
        return {
          publicKey: res.publicKey,
          chainCode: res.chainCode as string,
          address: res.address,
        };
      })
      .catch((err: LedgerError) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        throw new Error(ledgerErrToMessage(err));
      });
  }

  // @ts-ignore signature is different than parent.
  async init(dPath: string): Promise<ChainCodeResponse> {
    return await LedgerWalletProvider.getChainCode(dPath);
  }

  // @ts-ignore
  async unlock(
    address: string,
    dPath: string,
    index: number,
  ): Promise<LedgerWallet> {
    return new LedgerWallet(address || '', dPath, index);
  }

  connect(): PromiEvent<LedgerWallet> {
    log('this is an app?');
    const dpath =
      this._wallet.networkDictionary
        .get(31)
        ?.getWalletDPaths(WalletType.LEDGER)?.[0] || '';

    log('uses path', dpath);

    const promi = new PromiEvent<LedgerWallet>(async (resolve, reject) => {
      let condition = true;
      let chain;
      while (condition) {
        try {
          chain = await LedgerWalletProvider.getChainCode(dpath);
          condition = false;
          console.log(chain);
        } catch (e) {
          condition = false;
          error(e);
          reject('Something was wrong.');
        }
      }

      log('got wallet info?', dpath);

      resolve(new LedgerWallet(chain?.address || '', dpath, 0));
    });

    // this.app.get
    return promi;
  }

  disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }

  // getC
}

const isU2FError = (err: LedgerError): err is U2FError =>
  !!err && !!(err as U2FError).metaData;
const isStringError = (err: LedgerError): err is string =>
  typeof err === 'string';
const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  Object.prototype.hasOwnProperty.call(err, 'id') &&
  Object.prototype.hasOwnProperty.call(err, 'message');
export function ledgerErrToMessage(err: LedgerError) {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return translateRaw('LEDGER_TIMEOUT');
    }

    return err.metaData.type;
  }

  if (isStringError(err)) {
    // Wrong app logged into
    if (err.includes('6804')) {
      return translateRaw('LEDGER_WRONG_APP');
    }
    // Ledger locked
    if (err.includes('6801')) {
      return translateRaw('LEDGER_LOCKED');
    }

    return err;
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return translateRaw('U2F_NOT_SUPPORTED');
    }
  }

  // Other
  return err.toString();
}
