import { TzKt } from '../service/tzkt';
import * as D from './decoders';

export async function getLedgerBigMapObjkt(
    tzkt: TzKt,
    address: string
  ): Promise<D.LedgerBigMap> {
    const path = 'ledger';
    const data = await tzkt.getContractBigMapKeys(address, path);
    console.log("DATA call",data);
    const decoded = D.LedgerBigMap.decode(data);
    console.log("DECODED",decoded);
    return data;
}

export async function getTokenMetadataBigMapObjkt(
    tzkt: TzKt,
    address: string
  ): Promise<D.TokenMetadataBigMap> {
    const path = 'token_metadata';
    const data = await tzkt.getContractBigMapKeys(address, path);
    return data;
  }