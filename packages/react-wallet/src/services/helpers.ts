// @ts-ignore
function toBinary(string: string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  // @ts-ignore
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

export function base64Encode(string: string) {
  return btoa(string);
}

export function base64Decode(string: string) {
  return atob(string);
}
