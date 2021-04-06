import * as React from 'react';
import styled from 'styled-components/macro';

interface Option {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label: React.ReactNode;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select(props: Props) {
  return (
    <Container>
      <label htmlFor={props.id}>{props.label}</label>
      <select
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </Container>
  );
}

const Container = styled.div`
  max-width: 320xp;
  width: 100%;
  margin-bottom: 20px;
  label {
    margin-bottom: 10px;
    display: block;
    width: 100%;
    text-align: left;
  }
  select {
    display: block;
    width: 100%;
  }
`;
