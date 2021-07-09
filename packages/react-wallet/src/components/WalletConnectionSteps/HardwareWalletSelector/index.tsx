import * as React from 'react';
import { ProviderType } from '@sovryn/wallet';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
interface Props {
  onWalletSelected: (value: ProviderType) => void;
}

export function HardwareWalletSelector(props: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t(translations.dialogs.hardwareWallet.title)}:</h1>
      <ItemList>
        <Item
          image={images.ledgerWallet}
          title='Ledger'
          onClick={() => props.onWalletSelected(ProviderType.LEDGER)}
          linkHref='https://shop.ledger.com/?r=3035eca29af2'
          linkTitle='Buy Now'
        />
        <Item
          image={images.trezorWallet}
          title='Trezor'
          onClick={() => props.onWalletSelected(ProviderType.TREZOR)}
          linkHref='https://trezor.io/?offer_id=12&aff_id=7144&source=sovryn'
          linkTitle='Buy Now'
        />
      </ItemList>
      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t(translations.dialogs.providerTypes.instructions)}
        </a>
      </BottomLinkContainer>
    </div>
  );
}
