import { TzKt } from '../service/tzkt';
import * as D from './decoders';

export async function getLedgerBigMapCustom(
    tzkt: TzKt,
    address: string
  ): Promise<any> {
    const path = 'ledger';
    const data = await tzkt.getContractBigMapKeys(address, path);
    return data;
}

export async function getOwnedLedgerBigMapCustom(
  tzkt: TzKt,
  address: string,
  walletID: string
): Promise<any> {
  const path = 'ledger';
  const params = {
    'key.address': walletID
  }
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  return data;
}

export async function getTokenMetadataBigMapCustom(
    tzkt: TzKt,
    address: string
  ): Promise<D.TokenMetadataBigMap> {
    const path = 'token_metadata';
    const data = await tzkt.getContractBigMapKeys(address, path);
    return data;
  }

export async function getOwnedTokenMetadataBigMapCustom(
  tzkt: TzKt,
  address: string,
  keys: string[]
): Promise<any> {
  const path = 'token_metadata';

  return Promise.all(
    keys.map(async (key) => {
      const params = {
        'key': key
      }
      const data = await tzkt.getContractBigMapKeys(address, path, params);
      return data[0];
    })
  );
}