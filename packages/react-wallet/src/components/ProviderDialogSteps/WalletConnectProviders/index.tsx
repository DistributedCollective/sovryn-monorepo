import React, { useEffect } from 'react';
import { ProviderType } from '@sovryn/wallet';
import styled from 'styled-components/macro';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import QRCode from 'qrcode.react';
import { isMobile } from '../../../services/helpers';

interface Props {
  onWalletSelected: (value: ProviderType) => void;
  uri?: string;
}

export function WalletConnectProviders(props: Props) {
  useEffect(() => {
    props.onWalletSelected(ProviderType.WALLET_CONNECT);
  }, []);
  return (
    <div>
      <h1>Scan QR to Connect Wallet</h1>
      <Container>
        <LeftContainer>
          <p>Compatible mobile wallets</p>
          {!isMobile.iOS() && !isMobile.Android() && (
            <Item
              image={images.rskWallet}
              title='rwallet'
              small={true}
              onClick={() => {}}
            />
          )}

          {isMobile.iOS() && (
            <Item
              image={images.rskWallet}
              title='rwallet'
              small={true}
              linkHref={`rwallet://wc?uri=${props.uri}`}
              onClick={() => {}}
            />
          )}

          {isMobile.Android() && (
            <Item
              image={images.rskWallet}
              title='rwallet'
              small={true}
              linkHref={props.uri}
              onClick={() => {}}
            />
          )}
        </LeftContainer>

        <QRWrapper>
          {props.uri && (
            <QRCode
              value={props.uri || ''}
              size={300}
              renderAs='svg'
              includeMargin
            />
          )}
        </QRWrapper>
      </Container>

      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app'
          target='_blank'
          rel='noreferrer noopener'
        >
          For instructions on how to connect mobile wallets to SOVRYN visit our
          Wiki
        </a>
      </BottomLinkContainer>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 35px;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const QRWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
`;
