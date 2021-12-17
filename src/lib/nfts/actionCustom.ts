import { TzKt } from '../service/tzkt';
import * as D from './decoders';

export async function getLedgerBigMapCustom(
    tzkt: TzKt,
    address: string
  ): Promise<any> {
    const path = 'ledger';
    const data = await tzkt.getContractBigMapKeys(address, path);
    console.log("DATA call",data);
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