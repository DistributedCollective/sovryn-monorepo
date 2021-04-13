import * as React from 'react';
import { ProviderType } from '@sovryn/wallet';
import styled from 'styled-components/macro';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';

interface Props {
  onWalletSelected: (value: ProviderType) => void;
}

const wallet = detectInjectableWallet();

export function BrowserWalletSelector(props: Props) {
  return (
    <div>
      <h1>Select browser wallet type:</h1>
      <P>
        Make sure to disable other wallet browser extensions than the one you
        want to use.
      </P>
      <ItemList>
        <Item
          image={images.niftyWallet}
          title='Nifty'
          onClick={() => props.onWalletSelected(ProviderType.WEB3)}
          linkHref='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid'
          linkTitle='Download'
          disabled={wallet !== 'nifty'}
        />
        {wallet === 'liquality' && (
          <Item
            image={images.liqualityWallet}
            title='Liquality'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://liquality.io/atomic-swap-wallet.html'
            linkTitle='Download'
          />
        )}
        {/* <Item */}
        {/*  image={images.liqualityWallet} */}
        {/*  title='Liquality' */}
        {/*  onClick={() => props.onWalletSelected(ProviderType.WEB3)} */}
        {/*  linkHref='https://liquality.io/atomic-swap-wallet.html' */}
        {/*  linkTitle='Download' */}
        {/*  disabled={wallet !== 'liquality'} */}
        {/* /> */}
        {/* {wallet === 'nifty' && ( */}
        {/*  <Item */}
        {/*    image={images.niftyWallet} */}
        {/*    title='Nifty' */}
        {/*    onClick={() => props.onWalletSelected(ProviderType.WEB3)} */}
        {/*    linkHref='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid' */}
        {/*    linkTitle='Download' */}
        {/*  /> */}
        {/* )} */}
        {['metamask', 'unknown'].includes(wallet) && (
          <Item
            image={images.metamaskWallet}
            title='MetaMask'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://metamask.io/download.html'
            linkTitle='Download'
          />
        )}
        <Item
          image={images.portisWallet}
          title='Portis'
          onClick={() => props.onWalletSelected(ProviderType.PORTIS)}
          linkHref='https://www.portis.io'
          linkTitle='Learn More'
        />
      </ItemList>
      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app'
          target='_blank'
          rel='noreferrer noopener'
        >
          For instructions on how to connect to SOVRYN visit our Wiki
        </a>
      </BottomLinkContainer>
    </div>
  );
}

function detectInjectableWallet() {
  const { ethereum } = window as any;
  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
    if (ethereum.isLiquality) return 'liquality';
    if (ethereum.isNiftyWallet) return 'nifty';
    if (ethereum.isMetaMask) return 'metamask';
    return 'unknown';
  }
  return 'none';
}

const P = styled.p`
  margin: 0 auto;
  text-align: center;
`;
