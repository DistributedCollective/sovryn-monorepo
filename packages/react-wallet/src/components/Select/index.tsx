import * as React from 'react';
import styled from 'styled-components/macro';
import { images } from '../../assets/images';

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
      <SelectItem
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
      </SelectItem>
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
`;

const SelectItem = styled.select`
  display: block;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  background: #222222 url(${images.arrowDown}) right 10px center no-repeat;
  border: 1px solid #575757;
  border-radius: 8px;
  display: block;
  font: inherit;
  line-height: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #e9eae9;
  appearance: none;
  padding-right: 35px;
`;
