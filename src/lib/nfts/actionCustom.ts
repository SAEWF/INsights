import { TzKt } from '../service/tzkt';
import * as D from './decoders';
import firebase from '../firebase/firebase';

export async function getLedgerBigMapCustom(
    tzkt: TzKt,
    address: string
  ): Promise<any> {
    const path = 'ledger';
    const params = {
      'sort.desc': 'id'
    };
    const data = await tzkt.getContractBigMapKeys(address, path, params);
    return data;
}


export async function getLedgerBigMapCustomWithKey(
  tzkt: TzKt,
  address: string,
  key: string
): Promise<any> {
  const path = 'ledger';
  const params = {
    'key.nat': key
  };
  const data = await tzkt.getContractBigMapKeys(address, path, params);
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
    const params = {
      'sort.desc': 'id'
    };
    const data = await tzkt.getContractBigMapKeys(address, path, params);
    return data;
}

export async function getTokenMetadataBigMapCustomWithKey(
  tzkt: TzKt,
  address: string,
  key: string
): Promise<D.TokenMetadataBigMap> {
  const path = 'token_metadata';
  const params = {
    'key': key
  };
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  return data;
}

export async function getOwnedTokenMetadataBigMapCustom(
  tzkt: TzKt,
  address: string,
  keys: string[]
): Promise<any> {
  const path = 'token_metadata';

  return await Promise.all(
    keys.map(async (key) => {
      const params = {
        'key': key
      }
      const data = await tzkt.getContractBigMapKeys(address, path, params);
      return data[0];
    })
  );
}

export async function getContractFromFirebase(
  address: string
): Promise<any> {
  const db = firebase.firestore();
  const doc = await db.collection('collections').doc(address).get();
  if(!doc.exists) {
    return null;
  }
  return doc.data();
}