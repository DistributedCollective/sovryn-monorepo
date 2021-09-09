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
    if (
      provider === ProviderType.SOFTWARE_PK &&
      stripHexPrefix(value).length / 2 !== 32
    ) {
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
      <Input
        value={value}
        onChange={event => setValue(event.currentTarget.value)}
      />
      {error && <ErrorP>{error}</ErrorP>}
      <Button type='button' onClick={handleSubmit}>
        {t(translations.dialogs.softwareSelector.submit)}
      </Button>
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

const ErrorP = styled.p`
  margin: -15px auto 15px;
  text-align: center;
  font-size: 13px;
  color: #cd4e4e;
`;

const Input = styled.input`
  margin: 25px auto;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 4px 8px;
  background: #e9eae9;
  color: #000;
  font-weight: 500;
  width: 100%;
  max-width: 320px;
  display: block;
`;

const Button = styled.button`
  display: block;
  margin: 0 auto 25px;
  border: 1px solid #fec004;
  border-radius: 5px;
  padding: 8px 26px;
  color: #fec004;
  background-color: rgba(254, 192, 4, 0.25);
  cursor: pointer;
  transition: 0.3s background-color;
  &:hover {
    background-color: rgba(254, 192, 4, 0.2);
  }
`;
