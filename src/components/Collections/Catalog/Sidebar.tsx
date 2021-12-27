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
  const hash3points = state.collections['KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg'];
  const HEN = state.collections['KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'];
  const dispatch = useDispatch();
  const [objktState, setObjktState] = React.useState([]);

  useEffect(() => {
    // console.log('Sidebar useEffect');
    if(tzPublicKey && objktState.length === 0) {
      var db = firebase.firestore();
      db.collection("artists").doc(tzPublicKey).onSnapshot(function(doc) {
        if(doc.exists) {
          if(doc.data()!.collections===undefined) {
            setObjktState([]);
          }
          else{
            const objkt = doc.data()!.collections.filter((c: any) => c.name === 'objkt' && c.address!=='');
            setObjktState(objkt);
            for(let i=0; i<objkt.length; i++) {
              dispatch(getNftAssetContractQuery(objkt[i].address));
            }
          }
        }
        else{
          setObjktState([]);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tzPublicKey, objktState]);
 
  

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
          hash3points ? 
          <CollectionTab
            key={'KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg'}
            selected={'KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg']}
          />
          : null
        }
        {
          HEN ? 
          <CollectionTab
            key={'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'}
            selected={'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton']}
          />
          : null
        }

        {
          objktState.length>0 ?
          objktState.map((collection:any) => {
            return (
              <CollectionTab
                key={collection.address + 'objkt'}
                selected={collection.address === state.selectedCollection}
                onSelect={address => dispatch(selectCollection(collection.address))}
                {...state.collections[collection.address]}
              />
            );
          })
          : null
        }

      <AddObjktCollectionButton />
        
      <Flex px={2} pt={4} justify="center" pb={8}>
        <CreateCollectionButton />
      </Flex>
    </>
  );
}
