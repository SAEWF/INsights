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
  const kalamint = state.collections['KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse'];
  const geckos = state.collections['KT1AWUzFdNwZn7YprZitR6Q6eUuVmfUG1HMP'];
  const tzf = state.collections['KT1FnaopRwaUX9kNptcJgWvor2abqVd7iHCc'];
  const rari = state.collections['KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS'];
  const frog = state.collections['KT1QqTVamPvqEHMCKkzvYN8mxsxCCYjQKsdD'];
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
            const objkt = doc.data()!.collections.filter((c: any) => c && c.name === 'objkt' && c.address!=='');
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
          rari ? 
          <CollectionTab
            key={'KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS'}
            selected={'KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS']}
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
          kalamint ? 
          <CollectionTab
            key={'KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse'}
            selected={'KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse']}
          />
          : null
        }
        {/* {
          geckos ?
          <CollectionTab
            key={'KT1AWUzFdNwZn7YprZitR6Q6eUuVmfUG1HMP'}
            selected={'KT1AWUzFdNwZn7YprZitR6Q6eUuVmfUG1HMP' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1AWUzFdNwZn7YprZitR6Q6eUuVmfUG1HMP']}
          />
          : null
        }
        {
          tzf ?
          <CollectionTab
            key={'KT1FnaopRwaUX9kNptcJgWvor2abqVd7iHCc'}
            selected={'KT1FnaopRwaUX9kNptcJgWvor2abqVd7iHCc' === state.selectedCollection}
            onSelect={address => dispatch(selectCollection(address))}
            {...state.collections['KT1FnaopRwaUX9kNptcJgWvor2abqVd7iHCc']}
          />
          : null
        } */}
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
