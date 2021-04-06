import * as React from 'react';
import styled from 'styled-components/macro';

interface Props {
  text: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function Button(props: Props) {
  return (
    <ButtonItem onClick={props.onClick} disabled={props.disabled}>
      {props.text}
    </ButtonItem>
  );
}

const ButtonItem = styled.button.attrs(() => ({
  type: 'button',
}))`
  display: block;
  margin: 25px auto;
  width: 190px;
  height: 50px;
  transition: background 0.5s;
  will-change: background;
  border-radius: 8px;
  border: 0;
  background: #fec004;
  color: #000000;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background: rgba(254, 192, 4, 0.75);
  }
  &[disabled] {
    opacity: 0.25;
    cursor: not-allowed;
  }
`;
