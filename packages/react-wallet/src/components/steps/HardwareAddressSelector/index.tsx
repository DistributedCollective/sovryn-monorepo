import * as React from 'react';
import {
  getDeterministicWallets,
  DeterministicWalletData,
} from '@sovryn/wallet';
import { toChecksumAddress } from 'ethereumjs-util';
import styled, { css } from 'styled-components/macro';
import { Button } from '../../Button';
import { images } from '../../../assets/images';

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

  return (
    <div>
      <h1>Choose Wallet</h1>
      <WalletList>
        {state.wallets.map(item => (
          <WalletItem
            key={item.address}
            onClick={() => onSelect(item)}
            active={state.selected?.address === item.address}
          >
            <div className='key'>{item.index + 1}</div>
            <div className='value'>{item.address}</div>
          </WalletItem>
        ))}
        {state.wallets.length === 0 && (
          <div>
            No wallets in selected derivation path. Try changing path or app in
            your wallet.
          </div>
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

const WalletList = styled.div`
  padding: 16px 0;
  background: #222222;
  border: 1px solid #707070;
  border-radius: 5px;
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
  font-size: 12px;
  font-weight: 500;
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

  & .key {
    margin-right: 15px;
  }
`;

const Paginator = styled.div`
  margin: 15px auto;
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      background-image: url(${images.arrowLeft});
    `}
  ${(props: ArrowProps) =>
    props.right &&
    css`
      background-image: url(${images.arrowRight});
    `}
`;
