import * as React from 'react';
import styled from 'styled-components/macro';

interface Props {
  children: React.ReactNode;
}

export function BottomLinkContainer(props: Props) {
  return <Container>{props.children}</Container>;
}

const Container = styled.div`
  text-align: center;
`;
