import { bufferToInt } from 'ethereumjs-util';

export function padLeftEven(hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
}

export function sanitizeHex(hex: string) {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') return '';
  return '0x' + padLeftEven(hex);
}

export function bufferToHex(buffer: Buffer) {
  return '0x' + buffer.toString('hex');
}

export function getBufferFromHex(hex: string) {
  hex = sanitizeHex(hex);
  const _hex = hex.toLowerCase().replace('0x', '');
  return Buffer.from(_hex, 'hex');
}

export function calculateChainIdFromV(v: Buffer) {
  const sigV = bufferToInt(v);
  let chainId = Math.floor((sigV - 35) / 2);
  if (chainId < 0) chainId = 0;
  return chainId;
}
