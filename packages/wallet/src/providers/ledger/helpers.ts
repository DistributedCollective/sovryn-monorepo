import Transport from '@ledgerhq/hw-transport';

const dashboardNames = ['BOLOS', 'OLOS\u0000'];

export const isLedgerDashboardName = (name: string) => dashboardNames.includes(name);

export async function openLedgerApp(transport: Transport<any>, name: string) {
  await transport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from(name, 'ascii'));
}

export async function quitLedgerApp(transport: Transport<any>) {
  await transport.send(0xb0, 0xa7, 0x00, 0x00);
}

export async function getLedgerAppAndVersion(
  transport: Transport<any>,
): Promise<{ name: string; version: string; flags: Buffer }> {
  const r = await transport.send(0xb0, 0x01, 0x00, 0x00);
  let i = 0;
  const format = r[i++];
  if (format !== 1) {
    throw Error('getAppAndVersion: format not supported');
  }
  const nameLength = r[i++];
  const name = r.slice(i, (i += nameLength)).toString('ascii');
  const versionLength = r[i++];
  const version = r.slice(i, (i += versionLength)).toString('ascii');
  const flagLength = r[i++];
  const flags = r.slice(i, (i += flagLength));
  return { name, version, flags };
}

export async function getLedgerAppList(transport: Transport<any>) {
  const payload = await transport.send(0xe0, 0xde, 0, 0);
  const apps: {
    name: string;
    hash: string;
    hashCodeData: string;
    blocks: number;
    flags: number;
  }[] = [];
  let data = payload;
  // more than the status bytes
  while (data.length > 2) {
    if (payload[0] !== 0x01) {
      throw new Error('unknown listApps format');
    }
    let i = 1;
    while (i < data.length - 2) {
      const length = data[i];
      i++;
      const blocks = data.readUInt16BE(i);
      i += 2;
      const flags = data.readUInt16BE(i);
      i += 2;
      const hashCodeData = data.slice(i, i + 32).toString('hex');
      i += 32;
      const hash = data.slice(i, i + 32).toString('hex');
      i += 32;
      const nameLength = data[i];
      i++;
      if (length !== nameLength + 70) {
        throw new Error('invalid listApps length data');
      }
      const name = data.slice(i, i + nameLength).toString('ascii');
      i += nameLength;
      apps.push({
        name,
        hash,
        hashCodeData,
        blocks,
        flags,
      });
    }

    // continue
    data = await transport.send(0xe0, 0xdf, 0, 0);
  }

  return apps;
}
