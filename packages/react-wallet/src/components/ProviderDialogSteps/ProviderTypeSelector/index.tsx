import * as React from 'react';
import { ProviderType } from '@sovryn/wallet';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { ProviderDialogStep } from '../../../containers/ProviderDialog/types';
import { BottomLinkContainer } from '../../BottomLinkContainer';

interface Props {
  onStep: (value: ProviderDialogStep) => void;
  // todo remove after full wallet-connect integration
  onProvider: (value: ProviderType) => void;
}

export function ProviderTypeSelector(props: Props) {
  return (
    <div>
      <h1>Select wallet type:</h1>
      <ItemList>
        <Item
          image={images.hardwareWallets}
          title='Hardware'
          onClick={() => props.onStep(ProviderDialogStep.HARDWARE_PROVIDERS)}
        />
        {/* <Item */}
        {/*  image={images.mobileWallets} */}
        {/*  title='Mobile' */}
        {/*  onClick={() => props.onProvider(ProviderType.WALLET_CONNECT)} */}
        {/* /> */}
        <Item
          image={images.browserWallets}
          title='Browser'
          onClick={() => props.onStep(ProviderDialogStep.BROWSER_PROVIDERS)}
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
