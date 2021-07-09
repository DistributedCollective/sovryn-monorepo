import {
  DeterministicWalletData,
  getDeterministicWallets,
} from '@sovryn/wallet';
import { toChecksumAddress } from 'ethereumjs-util';
import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components/macro';

import { images } from '../../../assets/images';
import { translations } from '../../../locales/i18n';
import { toaster } from '../../../services/toaster';
import { Button } from '../../Button';
import { useEffect, useState } from 'react';
import { walletService } from '../../../services';
import { nodeService } from '../../../services/node';

interface Props {
  chainId: number;
  seed?: string;
  dPath: string;
  chainCode?: string;
  publicKey?: string;
  limit?: number;
  onUnlock: (address: string, index: number) => void;
}

export function HardwareAddressSelector(props: Props) {
  const [state, setState] = React.useState<{
    offset: number;
    wallets: DeterministicWalletData[];
    selected: DeterministicWalletData;
  }>({
    offset: 0,
    wallets: [],
    selected: undefined as any,
  });

  React.useEffect(() => {
    const wallets = getDeterministicWallets({
      seed: props.seed,
      dPath: props.dPath,
      chainCode: props.chainCode,
      publicKey: props.publicKey,
      limit: props.limit || 10,
      offset: state.offset,
    }).map(item => ({
      index: item.index,
      address: toChecksumAddress(item.address, props.chainId),
    }));
    setState(prevState => ({ ...prevState, wallets }));
  }, [
    props.seed,
    props.dPath,
    props.chainCode,
    props.publicKey,
    props.limit,
    state.offset,
  ]);

  const onSelect = React.useCallback(
    (item: DeterministicWalletData) => {
      setState(prevState => ({ ...prevState, selected: item }));
    },
    [state],
  );

  const onUnlock = React.useCallback(() => {
    props.onUnlock(state.selected.address, state.selected.index);
  }, [state]);

  const onChangeOffset = React.useCallback(
    (offset: number) => {
      setState(prevState => ({ ...prevState, offset: offset }));
    },
    [state],
  );
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t(translations.dialogs.hardwareSelector.title)}</h1>
      <WalletList>
        {state.wallets.map(item => (
          <WalletAddressRow
            key={item.address}
            chainId={props.chainId}
            item={item}
            state={state}
            onSelect={onSelect}
          />
        ))}
        {state.wallets.length === 0 && (
          <div>{t(translations.dialogs.hardwareSelector.noWallet)}</div>
        )}
      </WalletList>
      <div>
        <Paginator>
          <Arrow
            onClick={() => onChangeOffset(state.offset - (props.limit || 10))}
            disabled={state.offset <= 0}
            left
          />
          <Arrow
            onClick={() => onChangeOffset(state.offset + (props.limit || 10))}
            right
          />
        </Paginator>
        <div>
          <Button
            disabled={!state.selected}
            onClick={onUnlock}
            text='Confirm'
          />
        </div>
      </div>
    </div>
  );
}

HardwareAddressSelector.defaultProps = {
  limits: 10,
};

function useGetBalance(chainId: number, address: string) {
  const [state, setState] = useState({
    loading: false,
    balance: '0',
    asset: 'RBTC',
  });

  useEffect(() => {
    const network = walletService.networkDictionary.get(chainId);
    if (network) {
      setState(prevState => ({
        ...prevState,
        asset: network.getCurrencyName(),
        loading: true,
      }));
    }

    nodeService.getBalance(chainId, address).then(balance => {
      setState(prevState => ({ ...prevState, loading: false, balance }));
    });
  }, [chainId, address]);

  return state;
}

interface WalletAddressRowProps {
  item: DeterministicWalletData;
  state: any;
  chainId: number;
  onSelect: (item: DeterministicWalletData) => void;
}

function WalletAddressRow({
  item,
  state,
  chainId,
  onSelect,
}: WalletAddressRowProps) {
  const { t } = useTranslation();
  const value = useGetBalance(chainId, item.address);
  return (
    <WalletItem
      onClick={() => onSelect(item)}
      active={state.selected?.address === item.address}
      title={item.address}
    >
      <CopyToClipboard
        text={item.address}
        onCopy={() =>
          toaster.show(
            {
              message: t(translations.dialogs.hardwareWallet.success),
              intent: 'success',
            },
            'btc-copy',
          )
        }
      >
        <div className='copy'>
          <img src={images.copyIcon} alt='copy' />
        </div>
      </CopyToClipboard>
      <div className='key'>{item.index + 1}.</div>
      <div className='value'>{item.address}</div>
      <div className='divide'>-</div>
      <div className='amount'>Balance:</div>
      <div className='amountNum'>
        {(Number(value.balance) / 1e18).toFixed(4)}
      </div>
      <div className='asset'>{value.asset}</div>
    </WalletItem>
  );
}

const WalletList = styled.div`
  padding: 16px 0;
  background: #222222;
  border: 1px solid #707070;
  border-radius: 5px;
  max-width: 760px;
  min-height: 350px;
  margin: 0 auto;
`;

interface WalletItemProps {
  active?: boolean;
}

const WalletItem = styled.button`
  padding: 8px 16px;
  border: 0;
  background: transparent;
  display: flex;
  width: 100%;
  color: #e9eae9;
  transition: background-color 0.3s, border-color 0.3s;
  will-change: background-color, border-color;
  border: 3px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #454545;
  }
  ${(props: WalletItemProps) =>
    props.active &&
    css`
      background-color: #454545;
      border-color: #e9eae9;
    `}
  & .copy {
    margin-right: 30px;
  }
  & .key {
    margin-right: 5px;
    flex-grow: 0;
    flex-shrink: 1;
    width: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    font-family: 'Montserrat';
  }
  & .value {
    flex-grow: 0;
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    text-transform: none;
    font-size: 14px;
    font-weight: 300;
    font-family: 'Montserrat';
    width: 370px;
    flex: 'none';
  }
  & .divide {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat';
    text-align: center;
    width: 15px;
  }
  & .amount {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat';
    text-align: center;
    width: 70px;
  }
  & .amountNum {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat';
    text-align: right;
    width: 125px;
  }
  .symbol {
    font-size: 0.75em;
    opacity: 0.5 !important;
  }
  .asset {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat';
    width: 50px;
  }
`;

const Paginator = styled.div`
  margin: 15px auto;
  width: 100%;
  max-width: 330px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .pagi {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    max-width: 270px;
    max-height: 30px;
    height: 100%;
  }
  & .highlight {
    background-color: #2274a5;
    border-radius: 50%;
  }
  & .pagiItem {
    display: flex;
    width: 30px;
    font-size: 18px;
    font-weight: 500;
    font-family: 'Montserrat';
    align-items: center;
    justify-content: center;
    height: 30px;
  }
`;

interface ArrowProps {
  left?: boolean;
  right?: boolean;
}

const Arrow = styled.button`
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent center center no-repeat;
  background-image: url(${images.arrowRight});
  cursor: pointer;
  transition: opacity 0.3s;
  will-change: opacity;
  &:hover {
    opacity: 0.75;
  }
  &[disabled] {
    opacity: 0.25;
    cursor: not-allowed;
  }
  ${(props: ArrowProps) =>
    props.left &&
    css`
      transform: rotateY(180deg);
    `}
`;
