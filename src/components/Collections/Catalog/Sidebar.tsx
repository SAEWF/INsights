import React from 'react';
import { Heading } from '@chakra-ui/react';
// import { CreateCollectionButton } from '../../common/modals/CreateCollection';
import { useSelector, useDispatch } from '../../../reducer';
import {
  selectCollection
} from '../../../reducer/slices/collections';
import CollectionTab from './CollectionTab';

export default function Sidebar() {
  const tzPublicKey = useSelector(s => s.system.tzPublicKey);
  const state = useSelector(s => s.collections);
  const dispatch = useDispatch();
  return (
    <>
      <Heading px={4} pt={6} pb={4} size="md" color="brand.darkGray">
        ByteBlock Collections
      </Heading>
      <Heading
        fontFamily="mono"
        px={4}
        pb={2}
        fontSize="sm"
        color="brand.darkGray"
      >
        Recent Collection
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
        .
      </Heading>

      {/* <Flex px={2} pt={4} justify="center" pb={8}>
        <CreateCollectionButton />
      </Flex> */}
    </>
  );
}
