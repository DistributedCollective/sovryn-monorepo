import LedgerEth from '@ledgerhq/hw-app-eth';
// import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
// import Transport from '@ledgerhq/hw-transport';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
// import { serializeTransaction, Signature, UnsignedTransaction } from 'ethers/utils';
import { debug } from '@sovryn/common';
import { ChainCodeResponse, LedgerWallet } from '../wallets';
import { WalletProviderInterface } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:ledger-provider');

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
  const transport = await getTransport();
  return new LedgerEth(transport);
}

export class LedgerWalletProvider implements WalletProviderInterface {
  public static async getChainCode(dPath: string): Promise<ChainCodeResponse> {
    return makeApp()
      .then(app => app.getAddress(dPath, false, true))
      .then(res => {
        return {
          publicKey: res.publicKey,
          chainCode: res.chainCode as string,
        };
      })
      .catch((err: LedgerError) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        throw new Error(ledgerErrToMessage(err));
      });
  }

  // @ts-ignore
  async unlock(
    dPath: string,
    address: string,
    index: number,
  ): Promise<LedgerWallet> {
    return new LedgerWallet(address, dPath, index);
  }
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
