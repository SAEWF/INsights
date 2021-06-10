//this component only used for Creating Base Collection(Minter) for /create route 

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from '../../reducer';
import {
  getWalletAssetContractsQuery,
  getNftAssetContractQuery
} from '../../reducer/async/queries';
import { selectCollection } from '../../reducer/slices/collections';

export default function CreateBaseCollection() {
  const system = useSelector(s => s.system);
  const collections = useSelector(s => s.collections);
  const dispatch = useDispatch();

  const globalCollection =
    collections.collections[collections.globalCollection];

  useEffect(() => {
    if (!globalCollection) {
      dispatch(getNftAssetContractQuery(collections.globalCollection));
      return;
    }
    if (collections.selectedCollection === null) {
      dispatch(selectCollection(collections.globalCollection));
      return;
    }
  }, [
    globalCollection,
    collections.selectedCollection,
    collections.globalCollection,
    dispatch
  ]);

  useEffect(() => {
    if (system.status === 'WalletConnected') {
      dispatch(getWalletAssetContractsQuery());
    }
  }, [system.status, dispatch]);

  // const selectedCollection = collections.selectedCollection;
  if (system.walletReconnectAttempted && system.status !== 'WalletConnected') {
    return (
      <></>
    );
  }

  return (
    <></>

  );
}
