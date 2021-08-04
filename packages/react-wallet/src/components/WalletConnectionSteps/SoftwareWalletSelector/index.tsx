import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProviderType } from '@sovryn/wallet';
import styled from 'styled-components/macro';
import { stripHexPrefix } from 'ethjs-util';

import { translations } from '../../../locales/i18n';
import { BottomLinkContainer } from '../../BottomLinkContainer';

interface Props {
  onWalletSelected: (provider: ProviderType, entropy: string) => void;
  hideInstructionLink?: boolean;
}

export function SoftwareWalletSelector(props: Props) {
  const { t } = useTranslation();

  const [provider] = useState<ProviderType>(ProviderType.SOFTWARE_PK);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(() => {
    if (provider === ProviderType.SOFTWARE_PK && stripHexPrefix(value).length / 2 !== 32) {
      setError('Value is not valid private key.');
    } else {
      setError(undefined);
      props.onWalletSelected(provider, value);
    }
  }, [value, provider]);

  return (
    <div>
      <h1>{t(translations.dialogs.softwareSelector.title)}:</h1>
      <P>{t(translations.dialogs.softwareSelector.pk)}</P>
      <div>
        <input
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
        />
        <button type='button' onClick={handleSubmit}>
          {t(translations.dialogs.softwareSelector.submit)}
        </button>
        {error && <p>{error}</p>}
      </div>
      {!props.hideInstructionLink && (
        <BottomLinkContainer>
          <a
            href='https://wiki.sovryn.app'
            target='_blank'
            rel='noreferrer noopener'
          >
            {t(translations.dialogs.softwareSelector.learn)}
          </a>
        </BottomLinkContainer>
      )}
    </div>
  );
}

const P = styled.p`
  margin: 0 auto;
  text-align: center;
`;
