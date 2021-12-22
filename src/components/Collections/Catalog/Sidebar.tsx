import React, {useEffect} from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import { CreateCollectionButton, AddObjktCollectionButton } from '../../common/modals/CreateCollection';
import { useSelector, useDispatch } from '../../../reducer';
import {
  selectCollection
} from '../../../reducer/slices/collections';
import CollectionTab from './CollectionTab';
import firebase from '../../../lib/firebase/firebase';
import { getNftAssetContractQuery } from '../../../reducer/async/queries';
// import collections from '../../../lib/customCollections/collections';

export default function Sidebar() {
  const tzPublicKey = useSelector(s => s.system.tzPublicKey);
  const state = useSelector(s => s.collections);

  const kraznik = state.collections['KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr'];
  const dispatch = useDispatch();
  const [objktState, setObjktState] = React.useState('');

  useEffect(() => {
    console.log('Sidebar useEffect');
    if(tzPublicKey) {
      var db = firebase.firestore();
      db.collection("artists").doc(tzPublicKey).onSnapshot(function(doc) {
        if(doc.exists) {
          if(doc.data()!.collections===undefined) {
            setObjktState('not-set');
          }
          else{
            const objkt = doc.data()!.collections.filter((c: any) => c.name === 'objkt');
            setObjktState(objkt[0].address);
            dispatch(getNftAssetContractQuery(objkt[0].address));
          }
        }
        else{
          setObjktState('not-set');
        }
      });
    }
  }, [tzPublicKey, objktState, dispatch]);

  return (
    <>
      <Heading px={4} pt={6} pb={4} size="md" color="brand.darkGray">
        Collections
      </Heading>
      <Heading
        fontFamily="mono"
        px={4}
        pb={2}
        fontSize="sm"
        color="brand.darkGray"
      >
        ByteBlock Default Collection
      </Heading>
      {state.collections[state.globalCollection] ? (
        <CollectionTab
          key={state.globalCollection}
          selected={state.globalCollection === state.selectedCollection}
          onSelect={address => dispatch(selectCollection(address))}
          {...state.collections[state.globalCollection]}
        />
      ) : null}
      {/* {
        collections.secondary.map((collection:any) => {
          return (
            <CollectionTab
              key={collection.address}
              selected={collection.address === state.selectedCollection}
              onSelect={address => dispatch(selectCollection(collection.address))}
              {...collection}
            />
          );
        })
      } */}
      <Heading
        fontFamily="mono"
        px={4}
        pt={4}
        pb={2}
        fontSize="sm"
        color="brand.darkGray"
      >
        Other Collections
      </Heading>
      {Object.keys(state.collections)
        .filter(
          address =>
            address !== state.globalCollection &&
            state.collections[address]?.creator?.address === tzPublicKey
        ).reverse()
        .map((address, idx) => (
          <CollectionTab
            key={address + idx}
            selected={address === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections[address]}
          />
        ))}
        {
          kraznik ? 
          <CollectionTab
            key={'KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr'}
            selected={'KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr']}
          />
          : null
        }
        {
          objktState==='not-set' ? (
            <AddObjktCollectionButton />
          ) :
          <></>
        }
        {
          objktState!=='not-set' && objktState!==''? (
            <CollectionTab
              key={ objktState + 'objkt'}
              selected={objktState === state.selectedCollection}
              onSelect={address => dispatch(selectCollection(objktState))}
              {...state.collections[objktState]}
            />
          ) :
          <></>
        }
      <Flex px={2} pt={4} justify="center" pb={8}>
        <CreateCollectionButton />
      </Flex>
    </>
  );
}
