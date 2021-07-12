import {
  ChainCodeResponse,
  LedgerWalletProvider,
  ProviderType,
  TrezorWalletProvider,
} from '@sovryn/wallet';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { images } from '../../../assets/images';
import { translations } from '../../../locales/i18n';
import { walletService } from '../../../services';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { Button } from '../../Button';
import { Select } from '../../Select';

interface Props {
  chainId?: number;
  provider: ProviderType;
  onComplete: (
    response: ChainCodeResponse,
    chainId: number,
    dPath: string,
  ) => void;
}

export function HardwarePathChooser(props: Props) {
  const [state, setState] = React.useState({
    chainId: props.chainId || 30, // makes RSK (30) default selection
    dPath: '',
    loading: false,
    error: '',
  });

  const networks = React.useMemo(() => {
    return walletService.networkDictionary.list();
  }, [props.chainId]);
  const networkName = React.useMemo(() => {
    return walletService.networkDictionary.get(state.chainId)?.getName();
  }, [state.chainId]);

  const paths = React.useMemo(() => {
    const networks = walletService.networkDictionary.get(state.chainId);
    if (!networks) return [];
    return networks.getWalletDPaths(props.provider) || [];
  }, [state.chainId, props.provider]);

  React.useEffect(() => {
    let path = state.dPath;

    if (!paths?.length) {
      path = '';
    } else if (
      (paths?.length && !state.dPath) ||
      (paths?.length &&
        state.dPath &&
        !paths.find(item => item.path === state.dPath))
    ) {
      path = paths[0].path;
    }

    setState(prevState => ({
      ...prevState,
      dPath: path,
    }));
  }, [state.dPath, paths]);

  const onSubmit = React.useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    try {
      await walletService.start(props.provider);
      const response = await getChainCode(props.provider, state.dPath);
      props.onComplete(response, state.chainId, state.dPath);
    } catch (e) {
      console.error(e);
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: prettifyErrorMessage(e, props.provider),
      }));
    }
  }, [state, props.provider]);

  const onChangeChain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setState(prevState => ({
      ...prevState,
      chainId: Number(value),
    }));
  };

  const onChangePath = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setState(prevState => ({
      ...prevState,
      dPath: value,
    }));
  };
  const { t } = useTranslation();

  return (
    <Container>
      <h1>
        {t(translations.dialogs.hardwarePath.title, {
          name: getTitle(props.provider),
        })}
      </h1>
      <Image src={getLogo(props.provider)} />
      {props.provider === ProviderType.LEDGER &&
        (state.error === '' ? (
          <P>
            {t(translations.dialogs.hardwarePath.disable, {
              networkName,
            })}
          </P>
        ) : (
          <div className='alert'>
            <img src={images.errorIcon} className='alertImg' alt='error' />
            <span className='alertText'>{state.error}</span>
          </div>
        ))}
      {!props.chainId && (
        <Select
          id='network'
          label='Choose a network:'
          value={String(state.chainId)}
          options={networks.map(item => ({
            value: item.getChainId().toString(),
            label: item.getName(),
          }))}
          onChange={onChangeChain}
        />
      )}
      {paths?.length ? (
        <Select
          id='path'
          label='Derivation path:'
          value={state.dPath}
          options={paths.map(item => ({
            value: item.path,
            label: `${item.label} - ${item.path}`,
          }))}
          onChange={onChangePath}
        />
      ) : (
        <P>
          DApp doesn't have any {getDeviceName(props.provider)} paths for{' '}
          {networkName || 'selected network'}
        </P>
      )}
      <Button
        onClick={onSubmit}
        disabled={!state.chainId || !state.dPath || state.loading}
        text='Continue'
      />
      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app/en/technical-documents/wallet-derivation-paths'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t(translations.dialogs.providerTypes.ledgerInstructions)}
        </a>
      </BottomLinkContainer>
    </Container>
  );
}

function prettifyErrorMessage({ message }: Error, provider: ProviderType) {
  if (provider === ProviderType.LEDGER) {
    if (message.includes('TransportInterfaceNotAvailable')) {
      return "Unable to connect to device - make sure it's not used in another site.";
    }

    // if (message.includes('0x6a80')) {
    //   return 'Ledger device is locked.';
    // }

    if (message.includes('0x6700')) {
      return 'Open app in your ledger device.';
    }

    if (message.includes('0x6804')) {
      return 'Device is locked or wrong app used.';
    }
  }

  return message;
}

function getTitle(provider: ProviderType) {
  const titles = {
    [ProviderType.LEDGER]: 'Ledger',
    [ProviderType.TREZOR]: 'Trezor',
  };

  // eslint-disable-next-line no-prototype-builtins
  if (titles.hasOwnProperty(provider)) {
    return titles[provider];
  }

  return 'Choose Path';
}

function getDeviceName(provider: ProviderType) {
  const titles = {
    [ProviderType.LEDGER]: 'Ledger',
    [ProviderType.TREZOR]: 'Trezor',
  };

  // eslint-disable-next-line no-prototype-builtins
  if (titles.hasOwnProperty(provider)) {
    return titles[provider];
  }

  return 'Device';
}

function getChainCode(provider: ProviderType, dPath: string) {
  switch (provider) {
    case ProviderType.LEDGER:
      return LedgerWalletProvider.getChainCode(dPath);
    case ProviderType.TREZOR:
      return TrezorWalletProvider.getChainCode(dPath);
    default:
      throw Error('Unknown HD device.');
  }
}

function getLogo(provider: ProviderType) {
  const items = {
    [ProviderType.LEDGER]: images.ledgerWallet,
    [ProviderType.TREZOR]: images.trezorWallet,
  };

  // eslint-disable-next-line no-prototype-builtins
  if (items.hasOwnProperty(provider)) {
    return items[provider];
  }

  return items[ProviderType.TREZOR];
}

interface ImageProps {
  src: string;
}

const Image = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 35px;
  background: transparent center center no-repeat;
  border: 5px solid #e9eae9;
  border-radius: 20px;
  background-image: url('${(props: ImageProps) => props.src}');
`;

const P = styled.p`
  margin: 0 auto 35px;
  max-width: 236px;
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 300;
`;

const Container = styled.div`
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  .alert {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
  .alertImg {
    margin-right: 5px;
  }
  .alertText {
    color: #a52222;
  }
`;
